'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Beaker } from 'lucide-react';

export default function SandboxPage() {
  const [url, setUrl] = useState('https://api.github.com');
  const [failRate, setFailRate] = useState('0.5');
  const [failCodes, setFailCodes] = useState('500,503');
  const [minLatency, setMinLatency] = useState('100');
  const [maxLatency, setMaxLatency] = useState('5000');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timing, setTiming] = useState<{
    total: string;
    fetch?: string;
    simulatedLatency?: {
      range: string;
      actual: string;
    };
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setTiming(null);

    try {
      const response = await fetch(
        `/api/sandbox?url=${encodeURIComponent(url)}&failrate=${encodeURIComponent(failRate)}&failCodes=${encodeURIComponent(failCodes)}&minLatency=${encodeURIComponent(minLatency)}&maxLatency=${encodeURIComponent(maxLatency)}`,
        {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
      
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { error: 'Failed to parse JSON response' };
      }

      if (data.timing) {
        setTiming({
          total: `${data.timing.total}ms`,
          fetch: data.timing.fetch ? `${data.timing.fetch}ms` : undefined,
          simulatedLatency: data.timing.simulatedLatency ? {
            range: `${data.timing.simulatedLatency.min}ms - ${data.timing.simulatedLatency.max}ms`,
            actual: `${data.timing.simulatedLatency.actual}ms`
          } : undefined
        });
      }

      setResponse(JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: { ...data, timing: undefined }
      }, null, 2));
    } catch (err) {
      setResponse(JSON.stringify({
        error: err instanceof Error ? err.message : 'An error occurred',
        status: 'Network Error',
        statusText: 'Failed to fetch'
      }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-white-900 mb-6">
        Sandbox Testing
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>API Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="url" className="mb-2">
                Target URL
              </Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter target URL"
                required
              />
            </div>
            <div>
              <Label htmlFor="failRate" className="mb-2">
                Failure Rate (0-1)
              </Label>
              <Input
                id="failRate"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={failRate}
                onChange={(e) => setFailRate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="failCodes" className="mb-2">
                Failure Status Codes (comma-separated)
              </Label>
              <Input
                id="failCodes"
                value={failCodes}
                onChange={(e) => setFailCodes(e.target.value)}
                placeholder="e.g. 500,503"
                required
              />
            </div>
            <div>
              <Label htmlFor="minLatency" className="mb-2">
                Minimum Latency (ms)
              </Label>
              <Input
                id="minLatency"
                type="number"
                min="0"
                value={minLatency}
                onChange={(e) => setMinLatency(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="maxLatency" className="mb-2">
                Maximum Latency (ms)
              </Label>
              <Input
                id="maxLatency"
                type="number"
                min="0"
                value={maxLatency}
                onChange={(e) => setMaxLatency(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Beaker className="mr-2 h-4 w-4" />
                  Test API
                </>
              )}
            </Button>
          </form>

          {timing && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4 text-white-900">Timing</h3>
              <div className="bg-gray-100 p-4 rounded-md text-gray-900">
                <p>Total time: {timing.total}</p>
                {timing.fetch && <p>Fetch time: {timing.fetch}</p>}
              </div>
            </div>
          )}

          {response && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4 text-white-900">Response</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-gray-900">
                {response}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
} 