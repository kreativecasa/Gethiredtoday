import { NextResponse } from 'next/server';
import type { ATSCheckResult } from '@/types';

function calculateATSScore(resumeText: string, jobDescription?: string): ATSCheckResult {
  const text = resumeText.toLowerCase();
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  // Contact info checks
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
  const hasPhone = /(\+?1?\s?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/.test(text);
  const hasLinkedIn = text.includes('linkedin');

  // Section checks
  const hasSummary = text.includes('summary') || text.includes('objective') || text.includes('profile');
  const hasExperience = text.includes('experience') || text.includes('employment') || text.includes('work history');
  const hasEducation = text.includes('education') || text.includes('degree') || text.includes('university') || text.includes('college');
  const hasSkills = text.includes('skills') || text.includes('technologies') || text.includes('proficiencies');

  // Formatting red flags
  const hasTableKeywords = text.includes('colspan') || text.includes('rowspan');
  const hasGraphicKeywords = text.includes('<svg') || text.includes('<img');

  // Score calculation
  if (hasEmail) score += 10; else issues.push('Missing email address');
  if (hasPhone) score += 8; else issues.push('Missing phone number');
  if (hasLinkedIn) score += 5; else suggestions.push('Add your LinkedIn profile URL');
  if (hasSummary) score += 12; else { score -= 5; issues.push('No professional summary detected'); }
  if (hasExperience) score += 20; else issues.push('Work experience section missing or not clearly labeled');
  if (hasEducation) score += 10; else suggestions.push('Add education section');
  if (hasSkills) score += 12; else { issues.push('Skills section missing'); suggestions.push('Add a dedicated Skills section'); }
  if (!hasTableKeywords) score += 8;
  if (!hasGraphicKeywords) score += 5;

  // Length check
  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 300 && wordCount <= 800) score += 10;
  else if (wordCount < 300) {
    issues.push('Resume appears too short (under 300 words)');
    suggestions.push('Expand work experience bullet points with quantified achievements');
  } else {
    suggestions.push('Resume may be too long for ATS — aim for 1-2 pages');
  }

  // Keyword matching
  let keywordScore = 0;
  if (jobDescription) {
    const jobWords = jobDescription.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const matches = jobWords.filter(w => text.includes(w));
    keywordScore = Math.min(20, Math.round((matches.length / Math.max(jobWords.length, 1)) * 20));
    score += keywordScore;
    if (keywordScore < 10) suggestions.push('Add more keywords from the job description');
  } else {
    score += 10; // neutral if no job description
  }

  score = Math.max(0, Math.min(100, score));

  // Section scores
  return {
    overall_score: score,
    sections: {
      keywords: {
        score: jobDescription ? keywordScore * 5 : 70,
        issues: [],
        suggestions: jobDescription ? [] : ['Paste a job description for targeted keyword analysis'],
      },
      formatting: {
        score: (!hasTableKeywords && !hasGraphicKeywords) ? 90 : 50,
        issues: hasTableKeywords ? ['Tables detected — ATS may fail to parse'] : [],
        suggestions: ['Use simple formatting with no tables or graphics'],
      },
      structure: {
        score: (hasSummary && hasExperience && hasEducation && hasSkills) ? 95 : 60,
        issues: [],
        suggestions: [],
      },
      contact: {
        score: (hasEmail && hasPhone) ? 95 : hasEmail ? 70 : 40,
        issues: !hasEmail ? ['No email found'] : [],
        suggestions: !hasPhone ? ['Add phone number'] : [],
      },
      experience: {
        score: hasExperience ? 85 : 30,
        issues: !hasExperience ? ['Work experience section not found'] : [],
        suggestions: ['Use bullet points with quantified achievements (e.g., "Increased sales by 30%")'],
      },
    },
    top_issues: issues.slice(0, 5),
    top_suggestions: suggestions.slice(0, 5),
  };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body. Expected JSON with a "resumeText" field.' },
      { status: 400 }
    );
  }

  const resumeText =
    body && typeof body === 'object' && 'resumeText' in body && typeof (body as { resumeText: unknown }).resumeText === 'string'
      ? (body as { resumeText: string }).resumeText
      : '';
  const jobDescription =
    body && typeof body === 'object' && 'jobDescription' in body && typeof (body as { jobDescription: unknown }).jobDescription === 'string'
      ? (body as { jobDescription: string }).jobDescription
      : undefined;

  if (!resumeText || resumeText.trim().length < 50) {
    return NextResponse.json(
      { error: 'Please provide resume text with at least 50 characters.' },
      { status: 400 }
    );
  }

  try {
    const result = calculateATSScore(resumeText, jobDescription);
    return NextResponse.json(result);
  } catch (error) {
    console.error('ATS check error:', error);
    return NextResponse.json(
      { error: 'We hit a problem scoring your resume. Please try again in a moment.' },
      { status: 500 }
    );
  }
}
