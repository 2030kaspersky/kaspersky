import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { Project } from '../data/projects';
import StatusBadge from './StatusBadge';

const accentStyles: Record<Project['accent'], string> = {
  cyan: 'from-cyan-400/20 to-cyan-400/5',
  teal: 'from-teal-400/20 to-teal-400/5',
  blue: 'from-blue-400/20 to-blue-400/5',
  gold: 'from-amber-400/20 to-amber-400/5',
  violet: 'from-violet-400/20 to-violet-400/5',
  green: 'from-emerald-400/20 to-emerald-400/5',
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex min-h-[280px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30">
      <div
        className={'h-1.5 bg-gradient-to-l ' + accentStyles[project.accent]}
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-semibold text-[var(--primary)]">
            {project.category}
          </span>
          <StatusBadge status={project.status} />
        </div>
        <h3 className="mt-5 text-xl font-bold">{project.name}</h3>
        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
          {project.shortDescription}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
          <a
            href={'/project/?slug=' + encodeURIComponent(project.slug)}
            className="button-secondary"
          >
            التفاصيل <ArrowLeft className="h-4 w-4" />
          </a>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="button-ghost"
            >
              فتح المشروع <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
