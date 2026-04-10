import type { PatientContactItem, PatientIdentity } from "../../../types/patient";

type PatientProfileCardProps = {
  contactItems: PatientContactItem[];
  identity: PatientIdentity;
};

export function PatientProfileCard({
  contactItems,
  identity,
}: PatientProfileCardProps) {
  return (
    <article className="profile-card panel">
      <div className="avatar" id="patientAvatar">{identity.avatar}</div>
      <div className="patient-name-line">
        <h2 id="patientName">{identity.name}</h2>
        <span id="patientMetaText">
          {identity.gender} {identity.age}岁
        </span>
      </div>

      <dl className="patient-meta">
        {contactItems.map((item) => (
          <div key={item.label}>
            <dt aria-label={item.label} title={item.label}>
              {item.icon}
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
