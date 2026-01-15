import { Solar } from 'lunar-typescript';

const year = 2024;
const month = 5;
const day = 20;

console.log(`--- [양력] ${year}년 ${month}월 ${day}일 테스트 ---`);

const solar = Solar.fromYmd(year, month, day);
const lunar = solar.getLunar();

console.log("년주(Year Pillar):", lunar.getYearInGanZhi());
console.log("월주(Month Pillar):", lunar.getMonthInGanZhi());
console.log("일주(Day Pillar):", lunar.getDayInGanZhi());
