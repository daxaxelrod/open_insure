from policies.models import Risk, PolicyRiskSettings
from policies.risk.models import AudioEquipmentRisk, PhoneRisk


def get_phone_discount(risk: PhoneRisk, risk_settings: PolicyRiskSettings):
    running_discount = 0  # remember, basis points
    if risk.has_case and risk_settings.cell_phone_case_discount:
        running_discount += risk_settings.cell_phone_case_discount
    if risk.has_screen_protector and risk_settings.cell_phone_screen_protector_discount:
        running_discount += risk_settings.cell_phone_screen_protector_discount
    return running_discount


def get_audio_equipment_discount(
    risk: AudioEquipmentRisk, risk_settings: PolicyRiskSettings
):
    return 0
