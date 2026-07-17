export interface SessionContext {
    jobDescription: string;
    resume: string;
    createdAt: Date;
}
export interface CreateSessionResponse {
    sessionId: string;
    token: string;
    roomName: string;
    serverUrl: string;
}
export interface JobMetadata {
    sessionId: string;
}
export declare const SUMMARY_STREAM_TOPIC = "interview.summary";
export declare const STATUS_STREAM_TOPIC = "interview.status";
