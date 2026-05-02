import { Text, View } from "@tarojs/components";
import { PageContainer, PageSection, PageSectionCell, PageSectionRow } from "../../components/page-container";
import { PageAction, PageListItem, PageSectionHeader } from "../../components/page-primitives";
import { PageShell } from "../../components/page-shell";
import { patientMiniappMinePageData } from "../../shared/patientData";
import "./index.scss";

const minePageData = patientMiniappMinePageData;

export default function MinePage() {
  const { profile, support } = minePageData;

  return (
    <PageShell title="我的" bodyClassName="mine-page">
      <PageContainer>
        <PageSection>
          <View className="mine-page-profile-main">
            <View className="mine-page-avatar">{profile.name.slice(0, 1)}</View>
            <View className="mine-page-profile-copy">
              <Text className="mine-page-profile-name">{profile.name}</Text>
              <Text className="mine-page-profile-meta">
                {profile.gender} {profile.age}岁
              </Text>
              <Text className="mine-page-profile-code">患者编号 {profile.patientCode}</Text>
            </View>
          </View>
          <View className="mine-page-profile-phone">
            <Text className="mine-page-profile-phone-label">绑定手机号</Text>
            <Text className="mine-page-profile-phone-value">{profile.phone}</Text>
          </View>
        </PageSection>

        <PageSectionRow className="mine-page-shortcut-row">
          {minePageData.shortcuts.map((item) => (
            <PageSectionCell key={item.id} className="mine-page-shortcut-cell">
              <Text className="mine-page-shortcut-value">{item.value}</Text>
              <Text className="mine-page-shortcut-label">{item.label}</Text>
            </PageSectionCell>
          ))}
        </PageSectionRow>

        <PageSection>
          {minePageData.accountItems.map((item) => (
            <PageListItem key={item.id} label={item.label} value={item.value} />
          ))}
        </PageSection>

        <PageSection>
          <PageSectionHeader title={support.title} subtitle={support.description} />
          <PageAction className="mine-page-support-action">{support.actionText}</PageAction>
        </PageSection>
      </PageContainer>
    </PageShell>
  );
}
