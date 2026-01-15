import { Solar } from 'lunar-typescript';

import sajuMap from '@/assets/data/sajuMap.json';

type SajuInfo = {
    hanja: string;      // 예: 乙
    kor: string;        // 예: 을
    element: string;    // 예: Wood
    animal?: string;    // 지지에만 있음 (예: Snake), 띠
    color?: string;     // 천간에만 있음 (예: Green), 오행 색
}

// 날짜를 받아서 사주(연주, 월주, 일주)를 반환
export const useSaju = () => {
    
    const translate = (hanja: string, type: 'stem' | 'branch'): SajuInfo => {
    // sajuMap.stems['甲'] 이런 식으로 찾습니다.
    const data = type === 'stem' 
      ? (sajuMap.stems as any)[hanja] 
      : (sajuMap.branches as any)[hanja];

    return {
      hanja,
      kor: data.korean,
      element: data.element,
      animal: data.animal, // 천간일 경우 undefined
      color: data.color    // 지지일 경우 undefined
    };
    };
    const getGanji = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 양력 날짜 객체로 변환
    // 현재 날짜로 Solar 객체 생성
    const solar = Solar.fromYmd(year, month, day);
    
    // 현재 날짜인 객체를
    // 음력 날짜 객체로 변환
    const lunar = solar.getLunar();
    
    const yearGan = translate(lunar.getYearGan(), 'stem');
    const yearJi = translate(lunar.getYearZhi(), 'branch');
    const monthGan = translate(lunar.getMonthGan(), 'stem');
    const monthJi = translate(lunar.getMonthZhi(), 'branch');
    const dayGan = translate(lunar.getDayGan(), 'stem');
    const dayJi = translate(lunar.getDayZhi(), 'branch');
    
    return {
      year: { gan: yearGan, ji: yearJi },   // 연주 (상세 정보 포함)
      month: { gan: monthGan, ji: monthJi }, // 월주
      day: { gan: dayGan, ji: dayJi }       // 일주
    };
    };
    return { getGanji };
};