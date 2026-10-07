import { createContext, useContext, useState } from 'react';

// 가입 단계(Category → Information → Plan → Property → Sign) 사이에 입력값을 공유
// registration: { category, information, plan, property }
// 메모리에만 보관하므로 새로고침하면 초기화됨
const RegistrationContext = createContext(null);

export function RegistrationProvider({ children }){
  const [registration, setRegistration] = useState({});

  const saveStep = (step, values) => {
    setRegistration(prev => ({ ...prev, [step]: values }));
  };

  // 고객 유형이 바뀌면 이전 유형으로 입력한 내용은 버리고 다시 시작
  const startRegistration = (category) => {
    setRegistration(prev => (
      prev.category?.customerType === category.customerType
        ? { ...prev, category }
        : { category }
    ));
  };

  return (
    <RegistrationContext value={{ registration, saveStep, startRegistration }}>
      {children}
    </RegistrationContext>
  )
}

export function useRegistration(){
  const context = useContext(RegistrationContext);
  if (!context) throw new Error('useRegistration must be used within RegistrationProvider');
  return context;
}
