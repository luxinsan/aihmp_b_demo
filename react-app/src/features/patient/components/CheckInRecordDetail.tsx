import Image from "antd/es/image";
import type { CheckInRecord } from "../../../../../shared/types/checkIn";

function DietCheckInDetail({ record }: { record: Extract<CheckInRecord, { type: "饮食打卡" }> }) {
  return (
    <div className="checkin-detail-layout">
      <section className="diet-detail-card">
        <Image.PreviewGroup>
          <div className="diet-image-gallery">
            {record.images.map((image) => (
              <div className="diet-image-frame" key={image.id}>
                <Image alt={image.alt} className="diet-gallery-image" preview={{ mask: "查看大图" }} src={image.src} />
              </div>
            ))}
          </div>
        </Image.PreviewGroup>

        <section className="diet-analysis-block">
          <div className="checkin-detail-section-head">
            <h3>AI分析结果概述</h3>
          </div>
          <p>{record.aiOverview}</p>
        </section>

        <section className="diet-analysis-block">
          <div className="checkin-detail-section-head">
            <h3>营养分析</h3>
          </div>
          <div className="diet-nutrition-grid">
            {record.nutritionMetrics.map((metric) => (
              <article className="diet-nutrition-card" key={metric.id}>
                <strong>
                  {metric.value}
                  <span>{metric.unit}</span>
                </strong>
                <em>{metric.label}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="diet-analysis-block doctor-review-block">
          <div className="checkin-detail-section-head">
            <h3>医生评价</h3>
          </div>
          <p>{record.doctorComment}</p>
        </section>
      </section>
    </div>
  );
}

function ExerciseCheckInDetail({ record }: { record: Extract<CheckInRecord, { type: "运动打卡" }> }) {
  return (
    <div className="checkin-detail-layout">
      <section className="checkin-detail-meta-grid">
        <article>
          <span>训练时长</span>
          <strong>{record.duration}</strong>
        </article>
        <article>
          <span>训练强度</span>
          <strong>{record.intensity}</strong>
        </article>
        <article>
          <span>消耗热量</span>
          <strong>{record.caloriesBurned}</strong>
        </article>
        <article>
          <span>心率区间</span>
          <strong>{record.heartRateRange}</strong>
        </article>
      </section>
      <section className="checkin-detail-block">
        <div className="checkin-detail-section-head">
          <h3>训练内容</h3>
          <p>展示本次运动拆解和执行情况</p>
        </div>
        <ul className="checkin-detail-bullet-list">
          {record.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="checkin-detail-note-panel">
        <span>管理建议</span>
        <p>{record.coachComment}</p>
      </section>
    </div>
  );
}

function MedicationCheckInDetail({ record }: { record: Extract<CheckInRecord, { type: "用药打卡" }> }) {
  return (
    <div className="checkin-detail-layout">
      <section className="checkin-detail-meta-grid">
        <article>
          <span>依从性</span>
          <strong>{record.adherence}</strong>
        </article>
        <article>
          <span>风险提示</span>
          <strong>{record.riskFlag}</strong>
        </article>
      </section>
      <section className="checkin-detail-block">
        <div className="checkin-detail-section-head">
          <h3>用药明细</h3>
          <p>按时间点展示本次确认结果</p>
        </div>
        <div className="checkin-medication-table">
          {record.items.map((item) => (
            <article className="checkin-medication-row" key={item.id}>
              <strong>{item.name}</strong>
              <span>{item.dose}</span>
              <span>{item.time}</span>
              <em>{item.status}</em>
            </article>
          ))}
        </div>
      </section>
      <section className="checkin-detail-note-panel">
        <span>反馈记录</span>
        <p>{record.effectFeedback}</p>
      </section>
    </div>
  );
}

function VitalsCheckInDetail({ record }: { record: Extract<CheckInRecord, { type: "体征打卡" }> }) {
  return (
    <div className="checkin-detail-layout">
      <section className="checkin-detail-meta-grid">
        <article>
          <span>测量时段</span>
          <strong>{record.measurementWindow}</strong>
        </article>
        <article>
          <span>趋势判断</span>
          <strong>{record.trend}</strong>
        </article>
      </section>
      <section className="checkin-detail-block">
        <div className="checkin-detail-section-head">
          <h3>指标详情</h3>
          <p>用于查看单次体征打卡的关键数据</p>
        </div>
        <div className="checkin-vitals-grid">
          {record.metrics.map((metric) => (
            <article className="checkin-vitals-card" key={metric.id}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <em>{metric.status}</em>
            </article>
          ))}
        </div>
      </section>
      <section className="checkin-detail-note-panel">
        <span>随访建议</span>
        <p>{record.note}</p>
      </section>
    </div>
  );
}

export function CheckInRecordDetail({ record }: { record: CheckInRecord }) {
  switch (record.type) {
    case "饮食打卡":
      return <DietCheckInDetail record={record} />;
    case "运动打卡":
      return <ExerciseCheckInDetail record={record} />;
    case "用药打卡":
      return <MedicationCheckInDetail record={record} />;
    case "体征打卡":
    default:
      return <VitalsCheckInDetail record={record} />;
  }
}
