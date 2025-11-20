from app.auth.auth_models import User


def calculate_bmr(user: User) -> float:
    """
    기초대사량(BMR) 계산 (User 객체 사용)
    남성: 66.47 + (13.75 × 체중) + (5 × 키) - (6.76 × 나이)
    여성: 655.1 + (9.56 × 체중) + (1.85 × 키) - (4.68 × 나이)
    """
    if not user.age or not user.sex:
        return 0.0
    
    # User 모델에 키, 몸무게 필드가 없다면 기본값 사용
    weight = getattr(user, 'weight', None) or 70.0  # 기본값 70kg
    height_cm = getattr(user, 'height', None) or 170.0  # 기본값 170cm
    
    if user.sex.lower() in ['male', '남성', '남', 'm']:
        bmr = 66.47 + (13.75 * weight) + (5.0 * height_cm) - (6.76 * user.age)
    else:  # female
        bmr = 655.1 + (9.56 * weight) + (1.85 * height_cm) - (4.68 * user.age)
    
    return max(bmr, 0.0)


def calculate_bmr_from_params(age: int, sex: str, weight: float, height_cm: float) -> float:
    """
    기초대사량(BMR) 계산 (파라미터 사용)
    남성: 66.47 + (13.75 × 체중) + (5 × 키) - (6.76 × 나이)
    여성: 655.1 + (9.56 × 체중) + (1.85 × 키) - (4.68 × 나이)
    """
    if age <= 0 or weight <= 0 or height_cm <= 0:
        return 0.0
    
    if sex.lower() in ['male', '남성', '남', 'm']:
        bmr = 66.47 + (13.75 * weight) + (5.0 * height_cm) - (6.76 * age)
    else:  # female
        bmr = 655.1 + (9.56 * weight) + (1.85 * height_cm) - (4.68 * age)
    
    return max(round(bmr, 2), 0.0)


def calculate_bmi(weight: float, height_cm: float) -> float:
    """
    BMI 계산
    BMI = 체중(kg) / (키(m))^2
    """
    if weight <= 0 or height_cm <= 0:
        return 0.0
    
    height_m = height_cm / 100.0
    bmi = weight / (height_m ** 2)
    return round(bmi, 2)


def get_bmi_category(bmi: float) -> str:
    """
    BMI 카테고리 반환
    """
    if bmi < 18.5:
        return "저체중"
    elif bmi < 23:
        return "정상"
    elif bmi < 25:
        return "과체중"
    elif bmi < 30:
        return "비만"
    else:
        return "고도비만"


def calculate_tdee_from_params(bmr: float, activity_level: float) -> float:
    """
    총 일일 에너지 소비량(TDEE) 계산
    TDEE = BMR × 활동지수
    
    활동지수:
    - 1.2: 거의 활동 없음
    - 1.375: 가벼운 활동
    - 1.55: 보통 활동
    - 1.725: 높은 활동
    - 1.9: 매우 높은 활동
    """
    if activity_level not in [1.2, 1.375, 1.55, 1.725, 1.9]:
        activity_level = 1.55  # 기본값: 보통 활동
    
    tdee = bmr * activity_level
    return round(tdee, 2)

