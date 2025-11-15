// 웹 환경에서 devtools를 비활성화하기 위한 스텁
// devtools를 사용하지 않으므로 단순히 원본 함수를 반환하는 identity 함수

export const devtools = (fn, options) => {
  // 웹 환경에서는 devtools를 사용하지 않으므로 원본 함수를 그대로 반환
  return fn;
};

