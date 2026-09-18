import type { ProjectStatus } from '../data/projects';

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, string> = {
    منشور: 'status-published',
    'قيد التطوير': 'status-development',
    داخلي: 'status-internal',
    مؤرشف: 'status-archived',
    متوقف: 'status-stopped',
    تجريبي: 'status-experimental',
  };
  return (
    <span
      className={
        'inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ' +
        styles[status]
      }
    >
      {status}
    </span>
  );
}
