import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons";
import Button from "antd/es/button";
import type { CampusOption, LoginResult } from "../types/login";

type CampusSelectPanelProps = {
  loginResult: LoginResult;
  onBack: () => void;
  onSelectCampus: (campus: CampusOption) => void;
};

export function CampusSelectPanel({
  loginResult,
  onBack,
  onSelectCampus,
}: CampusSelectPanelProps) {
  return (
    <div className="campus-select-panel">
      <Button className="campus-back-button" icon={<ArrowLeftOutlined />} type="text" onClick={onBack}>
        返回
      </Button>

      <div className="campus-select-title">
        <h2>请选择进入的院区</h2>
      </div>

      <div className="campus-option-list">
        {loginResult.campuses.map((campus) => (
          <Button
            className="campus-option"
            key={campus.id}
            type="default"
            onClick={() => onSelectCampus(campus)}
          >
            <span className="campus-name">{campus.name}</span>
            <RightOutlined className="campus-option-arrow" />
          </Button>
        ))}
      </div>
    </div>
  );
}
