import { NextResponse } from 'next/server';
import { URLSearchParams } from 'url';

export async function GET(request: Request) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const failRate = parseFloat(searchParams.get('failrate') || '0');
  const failCodes = (searchParams.get('failCodes') || '').split(',').map(Number);
  const minLatency = parseInt(searchParams.get('minLatency') || '0', 10);
  const maxLatency = parseInt(searchParams.get('maxLatency') || '0', 10);

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // Simulate latency
  if (minLatency > 0 || maxLatency > 0) {
    const latency = Math.floor(Math.random() * (maxLatency - minLatency + 1)) + minLatency;
    await new Promise(resolve => setTimeout(resolve, latency));
  }

  // Simulate failure
  if (Math.random() < failRate) {
    const statusCode = failCodes[Math.floor(Math.random() * failCodes.length)] || 500;
    return NextResponse.json(
      { 
        error: 'Simulated failure',
        timing: {
          total: Date.now() - startTime,
          simulatedLatency: minLatency > 0 || maxLatency > 0 ? {
            min: minLatency,
            max: maxLatency,
            actual: maxLatency
          } : undefined
        }
      },
      { status: statusCode }
    );
  }

  try {
    const fetchStartTime = Date.now();
    const response = await fetch(targetUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    const fetchTime = Date.now() - fetchStartTime;
    const totalTime = Date.now() - startTime;

    return NextResponse.json({
      ...data,
      timing: {
        total: totalTime,
        fetch: fetchTime,
        simulatedLatency: minLatency > 0 || maxLatency > 0 ? {
          min: minLatency,
          max: maxLatency,
          actual: maxLatency
        } : undefined
      }
    }, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch',
        timing: {
          total: Date.now() - startTime,
          simulatedLatency: minLatency > 0 || maxLatency > 0 ? {
            min: minLatency,
            max: maxLatency,
            actual: maxLatency
          } : undefined
        }
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 