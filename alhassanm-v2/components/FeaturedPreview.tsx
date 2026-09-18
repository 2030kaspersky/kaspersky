'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  FileBarChart,
  FolderCheck,
  ListChecks,
  Medal,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import type { Project } from '../data/projects';

const scenarioMap: Record<string, string[]> = {
  'nabdh-madrasati': ['الدخول اليوم', 'التفاعل', 'المتابعة'],
  basirah: ['النتائج', 'الإتقان', 'المهارات'],
  himmah: ['الخطة', 'التنفيذ', 'الشواهد'],
  rikaz: ['السيرة', 'الإنجازات', 'الشواهد'],
  'school-top-ten': ['الرابع', 'الخامس', 'السادس'],
};

export default function FeaturedPreview({ project }: { project: Project }) {
  const scenarios = scenarioMap[project.slug] || ['نظرة عامة', 'التفاصيل', 'المتابعة'];
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(false);

  const cycle = () => {
    setRunning(true);
    setActive(value => (value + 1) % scenarios.length);
    window.setTimeout(() => setRunning(false), 420);
  };

  return (
    <div className='interactive-preview'>
      <div className='flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3'>
        <div>
          <p className='text-xs font-bold text-[var(--primary)]'>معاينة تفاعلية</p>
          <p className='mt-0.5 text-[10px] text-[var(--muted)]'>محاكاة واجهة · بيانات تجريبية</p>
        </div>
        <button type='button' onClick={cycle} className='preview-control' aria-label={'تغيير معاينة ' + project.name}>
          {running ? <RotateCcw className='h-4 w-4 animate-spin' /> : <Play className='h-4 w-4' />}
          جرّب
        </button>
      </div>

      <div className='flex gap-1 overflow-x-auto border-b border-[var(--border)] p-2' role='tablist' aria-label={'خيارات معاينة ' + project.name}>
        {scenarios.map((label, index) => (
          <button
            type='button'
            key={label}
            role='tab'
            aria-selected={active === index}
            onClick={() => setActive(index)}
            className={active === index ? 'preview-tab-active' : 'preview-tab'}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={'min-h-[188px] p-4 transition-opacity duration-300 ' + (running ? 'opacity-65' : 'opacity-100')}>
        <PreviewBody project={project} active={active} />
      </div>
    </div>
  );
}

function PreviewBody({ project, active }: { project: Project; active: number }) {
  if (project.slug === 'nabdh-madrasati') return <NabdhPreview active={active} />;
  if (project.slug === 'basirah') return <BasirahPreview active={active} />;
  if (project.slug === 'himmah') return <HimmahPreview active={active} />;
  if (project.slug === 'rikaz') return <RikazPreview active={active} />;
  if (project.slug === 'school-top-ten') return <TopTenPreview active={active} />;
  return <GenericPreview active={active} />;
}

function NabdhPreview({ active }: { active: number }) {
  const sets = [
    { value: '١٥٥', label: 'دخول تجريبي', bars: [78, 58, 88, 64, 92] },
    { value: '٤٢٪', label: 'تفاعل تجريبي', bars: [46, 72, 61, 85, 67] },
    { value: '٧٠', label: 'تحتاج متابعة', bars: [30, 44, 28, 56, 37] },
  ];
  const data = sets[active] || sets[0];
  return (
    <div>
      <div className='grid grid-cols-[1fr_auto] items-center gap-3'>
        <div>
          <p className='text-xs text-[var(--muted)]'>{data.label}</p>
          <strong className='mt-1 block text-3xl text-[var(--primary)]'>{data.value}</strong>
        </div>
        <span className='preview-icon'><Activity className='h-5 w-5' /></span>
      </div>
      <div className='mt-5 flex h-20 items-end gap-2' aria-label='رسم تجريبي'>
        {data.bars.map((height, index) => <span key={index} className='preview-bar' style={{ height: height + '%' }} />)}
      </div>
      <p className='mt-3 flex items-center gap-2 text-[11px] text-[var(--muted)]'><Sparkles className='h-3.5 w-3.5' />قراءة مصغرة للمؤشرات</p>
    </div>
  );
}

function BasirahPreview({ active }: { active: number }) {
  const insights = [
    ['متوسط الأداء', '٧٦٪', 'اتجاه مستقر'],
    ['نسبة الإتقان', '٦٨٪', 'تحتاج تعزيزًا'],
    ['مهارات مستهدفة', '١٢', '٣ أولويات'],
  ];
  const [label, value, note] = insights[active] || insights[0];
  const widths = [[82, 67, 74], [65, 72, 58], [88, 44, 69]][active] || [82, 67, 74];
  return (
    <div>
      <div className='flex items-center justify-between gap-3'>
        <span className='preview-icon'><FileBarChart className='h-5 w-5' /></span>
        <span className='rounded-full bg-[var(--soft)] px-2 py-1 text-[10px] text-[var(--muted)]'>تحليل تجريبي</span>
      </div>
      <p className='mt-4 text-xs text-[var(--muted)]'>{label}</p>
      <div className='mt-1 flex items-end justify-between gap-3'>
        <strong className='text-3xl text-[var(--primary)]'>{value}</strong>
        <span className='text-xs text-[var(--muted)]'>{note}</span>
      </div>
      <div className='mt-5 space-y-2'>
        {widths.map((width, index) => <div key={index} className='h-2 overflow-hidden rounded-full bg-[var(--soft)]'><span className='block h-full rounded-full bg-[var(--primary)] transition-all duration-500' style={{ width: width + '%' }} /></div>)}
      </div>
    </div>
  );
}

function HimmahPreview({ active }: { active: number }) {
  const stages = [
    { name: 'الخطة', progress: 82, icon: ListChecks },
    { name: 'التنفيذ', progress: 64, icon: Users },
    { name: 'الشواهد', progress: 48, icon: FolderCheck },
  ];
  const current = stages[active] || stages[0];
  const Icon = current.icon;
  return (
    <div>
      <div className='flex items-center gap-3'>
        <span className='preview-icon'><Icon className='h-5 w-5' /></span>
        <div><p className='text-xs text-[var(--muted)]'>مرحلة تجريبية</p><strong>{current.name}</strong></div>
      </div>
      <div className='mt-5 flex items-center justify-between text-xs'>
        <span className='text-[var(--muted)]'>نسبة التقدم</span>
        <strong className='text-[var(--primary)]'>{current.progress}٪</strong>
      </div>
      <div className='mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--soft)]'><span className='block h-full rounded-full bg-[var(--primary)] transition-all duration-500' style={{ width: current.progress + '%' }} /></div>
      <div className='mt-5 grid grid-cols-3 gap-2'>
        {stages.map((stage, index) => <div key={stage.name} className={'rounded-lg border p-2 text-center text-[10px] ' + (index <= active ? 'border-cyan-300/25 bg-cyan-300/5 text-[var(--foreground)]' : 'border-[var(--border)] text-[var(--muted)]')}><CheckCircle2 className='mx-auto mb-1 h-4 w-4' />{stage.name}</div>)}
      </div>
    </div>
  );
}

function RikazPreview({ active }: { active: number }) {
  const groups = [
    { title: 'السيرة الذاتية', done: 4, total: 4 },
    { title: 'شواهد الإنجاز', done: 7, total: 10 },
    { title: 'الخطط والاختبارات', done: 5, total: 8 },
  ];
  const group = groups[active] || groups[0];
  const percent = Math.round((group.done / group.total) * 100);
  return (
    <div>
      <div className='flex items-center justify-between'><span className='preview-icon'><ListChecks className='h-5 w-5' /></span><span className='text-xs text-[var(--muted)]'>{group.done} من {group.total}</span></div>
      <h4 className='mt-4 font-bold'>{group.title}</h4>
      <div className='mt-3 h-2.5 overflow-hidden rounded-full bg-[var(--soft)]'><span className='block h-full rounded-full bg-amber-300 transition-all duration-500' style={{ width: percent + '%' }} /></div>
      <div className='mt-5 space-y-2'>
        {[0, 1, 2].map(item => <div key={item} className='flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-xs'><CheckCircle2 className={'h-4 w-4 ' + (item < active + 1 ? 'text-emerald-400' : 'text-[var(--muted)]')} /><span>{['عنصر موثق', 'ملف مرفوع', 'مراجعة مكتملة'][item]}</span></div>)}
      </div>
    </div>
  );
}

function TopTenPreview({ active }: { active: number }) {
  const labels = ['الرابع', 'الخامس', 'السادس'];
  const scores = useMemo(() => [[99.4, 98.9, 98.2], [99.1, 98.7, 98.1], [99.6, 99.0, 98.4]][active] || [99.4, 98.9, 98.2], [active]);
  return (
    <div>
      <div className='flex items-center justify-between'>
        <span className='preview-icon'><Trophy className='h-5 w-5' /></span>
        <span className='text-[10px] text-[var(--muted)]'>صف {labels[active]} · بيانات تجريبية</span>
      </div>
      <div className='mt-6 flex items-end justify-center gap-2'>
        {[1, 0, 2].map((index, order) => (
          <div key={index} className={'w-20 rounded-t-lg border border-[var(--border)] bg-[var(--soft)] p-2 text-center ' + (order === 1 ? 'h-28' : order === 0 ? 'h-24' : 'h-20')}>
            {order === 1 ? <Medal className='mx-auto h-5 w-5 text-amber-300' /> : <span className='text-xs text-[var(--muted)]'>#{order === 0 ? 2 : 3}</span>}
            <p className='mt-2 text-xs font-bold'>طالب {['ب', 'أ', 'ج'][order]}</p>
            <p className='mt-1 text-[11px] text-[var(--primary)]'>{scores[index]}٪</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GenericPreview({ active }: { active: number }) {
  return (
    <div className='grid min-h-[160px] place-items-center text-center'>
      <div>
        <span className='preview-icon mx-auto'><BarChart3 className='h-5 w-5' /></span>
        <p className='mt-4 font-bold'>حالة العرض {active + 1}</p>
        <p className='mt-2 text-xs text-[var(--muted)]'>معاينة تفاعلية توضيحية</p>
      </div>
    </div>
  );
}
