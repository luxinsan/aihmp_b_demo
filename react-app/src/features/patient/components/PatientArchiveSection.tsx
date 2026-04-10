import type { PatientArchiveSection as PatientArchiveSectionType } from "../../../types/patient";

type PatientArchiveSectionProps = {
  section: PatientArchiveSectionType;
};

export function PatientArchiveSection({ section }: PatientArchiveSectionProps) {
  return (
    <article className="migration-panel">
      <header className="section-head">
        <div>
          <p className="eyebrow">Archive Block</p>
          <h3>{section.title}</h3>
        </div>
      </header>

      <div className="archive-field-grid">
        {section.fields.map((field) => (
          <article className="archive-field-card" key={`${section.title}-${field.label}`}>
            <span>{field.label}</span>
            <strong>{field.value}</strong>
          </article>
        ))}
      </div>
    </article>
  );
}
