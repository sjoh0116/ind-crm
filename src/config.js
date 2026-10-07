// 화면 확인용: true면 필수 입력/서명/동의 검증 없이 다음 단계로 넘어감
// 개발 서버(npm run dev)에서만 적용되고, 빌드(npm run build) 결과물에서는 항상 검증함
// 검증을 다시 켜려면 false로 바꾸면 됨
const SKIP_VALIDATION_IN_DEV = true;

export const SKIP_VALIDATION = import.meta.env.DEV && SKIP_VALIDATION_IN_DEV;
