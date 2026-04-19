import type { AdminPatientContactIconId, AdminPatientContactItem } from "../../../../../shared/adapters/admin";
import type { PatientIdentity } from "../../../../../shared/types/patient";

function renderContactIcon(iconId: AdminPatientContactIconId) {
  if (iconId === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.5 4.75h9a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V6.75a2 2 0 0 1 2-2Z" />
        <path d="M9 7.75h6" />
        <path d="M11.2 16.75h1.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.75" y="6.25" width="14.5" height="11.5" rx="2.5" />
      <path d="M8 10h4.25" />
      <path d="M8 13.25h7.5" />
      <circle cx="16.6" cy="10.15" r="1.2" />
    </svg>
  );
}

type PatientProfileCardProps = {
  contactItems: AdminPatientContactItem[];
  identity: PatientIdentity;
};

export function PatientProfileCard({
  contactItems,
  identity,
}: PatientProfileCardProps) {
  return (
    <article className="profile-card panel">
      <div className="profile-card-hero">
        <div className="avatar" id="patientAvatar">{identity.avatar}</div>
        <div className="patient-name-block">
          <div className="patient-name-line">
            <h2 id="patientName">{identity.name}</h2>
            <span className="patient-age-badge" id="patientMetaText">
              {identity.gender} {identity.age}岁
            </span>
          </div>
        </div>
      </div>

      <dl className="patient-meta">
        {contactItems.map((item) => (
          <div className="patient-meta-item" key={item.label}>
            <dt aria-label={item.label} title={item.label}>
              {renderContactIcon(item.iconId)}
            </dt>
            <dd id={item.label === "联系电话" ? "patientPhone" : item.label === "身份证号" ? "patientIdCard" : undefined}>
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
