// composables/useFortune.ts
import { ref, computed, nextTick, onMounted } from 'vue';

// 데이터 파일 import
import dayData from '@/assets/data/fortunes_day.json';
import monthData from '@/assets/data/fortunes_month.json';
import yearData from '@/assets/data/fortunes_year.json';

export const useFortune = () => {
  const { getGanji } = useSaju();

  // --- 상태 관리 ---
  const step = ref(1);
  const inputYear = ref('');
  const inputMonth = ref('');
  const inputDay = ref('');

  // --- DOM Refs ---
  const yearInputRef = ref<HTMLInputElement | null>(null);
  const monthInputRef = ref<HTMLInputElement | null>(null);
  const dayInputRef = ref<HTMLInputElement | null>(null);

  onMounted(() => { yearInputRef.value?.focus(); });

  // --- 힌트 로직 ---
  const yearHint = computed(() => {
    if (!inputYear.value || String(inputYear.value).length < 4) return '';
    const y = parseInt(inputYear.value);
    const tempSaju = getGanji(new Date(y, 5, 15));
    return `${tempSaju.year.gan.color} ${tempSaju.year.ji.animal}`; 
  });

  const monthHint = computed(() => {
    if (!inputMonth.value) return '';
    const m = parseInt(inputMonth.value);
    if ([1, 4, 7, 10].includes(m)) return { season: 'Transition (Earth)', element: 'Earth', desc: 'Born in a season of change. Reliable and steady.' };
    if ([2, 3].includes(m)) return { season: 'Spring (Wood)', element: 'Wood', desc: 'Born in the season of sprouting life. Forward-moving.' };
    if ([5, 6].includes(m)) return { season: 'Summer (Fire)', element: 'Fire', desc: 'Born in the season of blazing sun. Expressive and bright.' };
    if ([8, 9].includes(m)) return { season: 'Autumn (Metal)', element: 'Metal', desc: 'Born in the season of harvest. Principled and decisive.' };
    if ([11, 12].includes(m)) return { season: 'Winter (Water)', element: 'Water', desc: 'Born in the season of deep rest. Wise and flexible.' };
    return { season: '', element: '', desc: '' };
  });

  // --- 사주 및 운세 계산 로직 ---
  const mySaju = computed(() => {
    if (step.value < 4) return null;
    const y = parseInt(inputYear.value);
    const m = parseInt(inputMonth.value) - 1;
    const d = parseInt(inputDay.value);
    return getGanji(new Date(y, m, d, 12, 0, 0));
  });

  const now = new Date();
  now.setHours(12, 0, 0, 0); 
  const currentSaju = getGanji(now);

  const getFortune = (myPillar: any, targetPillar: any, dataSource: any) => {
    const myStem = myPillar.gan.element;
    const myBranch = myPillar.ji.element;
    const targetStem = targetPillar.gan.element;
    const targetBranch = targetPillar.ji.element;
    const complexKey = `${myStem}_${myBranch}_vs_${targetStem}_${targetBranch}`;

    if (dataSource[complexKey]) return dataSource[complexKey];
    return { title: "Analyzing...", score: 50, desc: "Reading the energy flow...", advice: "Stay calm." };
  };

  const dailyFortune = computed(() => {
    if (!mySaju.value) return null;
    return getFortune(mySaju.value.day, currentSaju.day, dayData);
  });

  const monthlyFortune = computed(() => {
    if (!mySaju.value) return null;
    return getFortune(mySaju.value.month, currentSaju.month, monthData);
  });

  const yearlyFortune = computed(() => {
    if (!mySaju.value) return null;
    return getFortune(mySaju.value.year, currentSaju.year, yearData);
  });

  // --- 액션(메서드) ---
  const goNext = async () => {
    const yLen = String(inputYear.value).length;
    if (step.value === 1 && yLen === 4) { 
      step.value = 2; 
      await nextTick(); monthInputRef.value?.focus(); 
    } else if (step.value === 2 && inputMonth.value) { 
      step.value = 3; 
      await nextTick(); dayInputRef.value?.focus(); 
    } else if (step.value === 3 && inputDay.value) { 
      step.value = 4; 
    }
  };

  const reset = async () => {
    step.value = 1; inputYear.value = ''; inputMonth.value = ''; inputDay.value = '';
    await nextTick(); yearInputRef.value?.focus();
  };

  // 템플릿에서 쓸 변수들 리턴
  return {
    step,
    inputYear, inputMonth, inputDay,
    yearInputRef, monthInputRef, dayInputRef,
    yearHint, monthHint,
    mySaju, now,
    dailyFortune, monthlyFortune, yearlyFortune,
    goNext, reset
  };
};