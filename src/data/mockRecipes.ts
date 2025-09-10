export interface Recipe {
  id: string;
  recipeName: string;
  calories: number;
  time: number;
  healthGoal: number;
  timeCategory: string;
  ingredientsOwned: number;
  totalIngredients: number;
  isFavorite: boolean;
  imageUrl: string;
  tags: string[];
  difficulty: "쉬움" | "보통" | "어려움";
  description: string;
}

export const mockRecipes: Recipe[] = [
  {
    id: "1",
    recipeName: "크림 시금치 파스타",
    calories: 531,
    time: 25,
    healthGoal: 80,
    timeCategory: "20분 이상",
    ingredientsOwned: 2,
    totalIngredients: 8,
    isFavorite: false,
    imageUrl: "../assets/images/tomato.jpg",
    tags: ["양식", "파스타", "메인요리"],
    difficulty: "보통",
    description: "부드러운 크림 소스와 신선한 시금치가 만나 완벽한 파스타"
  },
  {
    id: "2",
    recipeName: "토마토 리조또",
    calories: 420,
    time: 30,
    healthGoal: 70,
    timeCategory: "20분 이상",
    ingredientsOwned: 5,
    totalIngredients: 9,
    isFavorite: true,
    imageUrl: "../assets/images/tomato.jpg",
    tags: ["양식", "리조또", "메인요리"],
    difficulty: "보통",
    description: "신선한 토마토의 풍미가 가득한 크리미한 리조또"
  },
  {
    id: "3",
    recipeName: "닭가슴살 샐러드",
    calories: 280,
    time: 15,
    healthGoal: 95,
    timeCategory: "15분 이하",
    ingredientsOwned: 3,
    totalIngredients: 6,
    isFavorite: true,
    imageUrl: "../assets/images/tomato.jpg",
    tags: ["한식", "샐러드", "건강식"],
    difficulty: "쉬움",
    description: "단백질이 풍부한 닭가슴살과 신선한 채소의 만남"
  },
  {
    id: "4",
    recipeName: "연어 스테이크",
    calories: 350,
    time: 20,
    healthGoal: 85,
    timeCategory: "20분 이하",
    ingredientsOwned: 1,
    totalIngredients: 5,
    isFavorite: false,
    imageUrl: "../assets/images/tomato.jpg",
    tags: ["양식", "스테이크", "메인요리"],
    difficulty: "보통",
    description: "부드럽고 고소한 연어의 완벽한 조리법"
  },
  {
    id: "5",
    recipeName: "된장찌개",
    calories: 180,
    time: 25,
    healthGoal: 75,
    timeCategory: "20분 이상",
    ingredientsOwned: 4,
    totalIngredients: 7,
    isFavorite: true,
    imageUrl: "../assets/images/tomato.jpg",
    tags: ["한식", "국물요리", "메인요리"],
    difficulty: "쉬움",
    description: "구수한 된장의 깊은 맛이 일품인 전통 찌개"
  },
  {
    id: "6",
    recipeName: "치킨 커리",
    calories: 480,
    time: 35,
    healthGoal: 65,
    timeCategory: "20분 이상",
    ingredientsOwned: 2,
    totalIngredients: 10,
    isFavorite: false,
    imageUrl: "../assets/images/tomato.jpg",
    tags: ["인도식", "커리", "메인요리"],
    difficulty: "어려움",
    description: "향신료의 풍미가 가득한 매콤달콤한 치킨 커리"
  },
  {
    id: "7",
    recipeName: "아보카도 토스트",
    calories: 320,
    time: 10,
    healthGoal: 90,
    timeCategory: "15분 이하",
    ingredientsOwned: 3,
    totalIngredients: 4,
    isFavorite: true,
    imageUrl: "../assets/images/tomato.jpg",
    tags: ["양식", "브런치", "간식"],
    difficulty: "쉬움",
    description: "건강한 아보카도와 토스트의 완벽한 조합"
  },
  {
    id: "8",
    recipeName: "김치찌개",
    calories: 220,
    time: 30,
    healthGoal: 70,
    timeCategory: "20분 이상",
    ingredientsOwned: 5,
    totalIngredients: 8,
    isFavorite: true,
    imageUrl: "../assets/images/tomato.jpg",
    tags: ["한식", "국물요리", "메인요리"],
    difficulty: "보통",
    description: "시원하고 얼큰한 김치찌개로 속이 따뜻해지는 맛"
  },
  {
    id: "9",
    recipeName: "초콜릿 케이크",
    calories: 450,
    time: 60,
    healthGoal: 30,
    timeCategory: "60분 이상",
    ingredientsOwned: 4,
    totalIngredients: 8,
    isFavorite: false,
    imageUrl: "../assets/images/tomato.jpg",
    tags: ["디저트", "케이크", "간식"],
    difficulty: "어려움",
    description: "진한 초콜릿의 달콤함이 가득한 홈메이드 케이크"
  },
  {
    id: "10",
    recipeName: "스시 롤",
    calories: 380,
    time: 45,
    healthGoal: 85,
    timeCategory: "20분 이상",
    ingredientsOwned: 2,
    totalIngredients: 6,
    isFavorite: false,
    imageUrl: "../assets/images/tomato.jpg",
    tags: ["일식", "스시", "메인요리"],
    difficulty: "어려움",
    description: "신선한 생선과 밥의 완벽한 조화, 스시 롤"
  }
];
