export interface BreadcrumbItem {
  readonly name: string;
  readonly url: string;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface HowToStep {
  readonly name: string;
  readonly text: string;
  readonly url?: string;
  readonly image?: string;
}

export interface SoftwareAppSchemaOptions {
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly applicationCategory: string;
  readonly operatingSystem?: string;
}

export interface PageSeoProps {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly keywords?: readonly string[];
  readonly ogType?: "website" | "article";
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
  readonly noIndex?: boolean;
}
