declare module '@vercel/node' {
  export interface VercelRequest {
    method?: string;
    headers: Record<string, string | string[] | undefined>;
    body?: any;
    query?: any;
    cookies?: Record<string, string>;
  }

  export interface VercelResponse {
    status: (code: number) => VercelResponse;
    json: (body: any) => void;
    send: (body: any) => void;
    setHeader: (name: string, value: string) => void;
  }
}
