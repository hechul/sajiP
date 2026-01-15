<script setup lang="ts">
import { ref, computed } from 'vue';
// 운세 데이터 불러오기
import fortuneData from '@/assets/data/fortunes.json';
// 1. 사주 계산 로직 (기존과 동일)
const { getGanji } = useSaju();

const getTodayLocal = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작해서 +1 필요
  const day = String(now.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
// 2. 상태 관리 (YYYY-MM-DD)
const birthDate = ref(getTodayLocal());

// 3. 계산 (Computed)
const mySaju = computed(() => {
  if (!birthDate.value) return getGanji(new Date());
  // 타임존 이슈 해결을 위한 T00:00:00 추가
  return getGanji(new Date(birthDate.value + 'T00:00:00'));
  // T00:00:00 -> 사용자의 PC 시간(로컬 시간) 기준으로 0시
  // new Date를 거치면서 내부적으로 시차에따라 값이 바뀌기 때문에 붙여야 함.
});
// 오늘의 사주
const today = new Date(); // 실제 오늘 날짜
const todaySaju = getGanji(today);

const todayFortune = computed(() => {
  const myElement = mySaju.value.day.gan.element; // 예: Water (님)
  const todayElement = todaySaju.day.gan.element; // 예: Earth (오늘 1/15)
  
  // Key 만들기: "Water_Earth"
  const key = `${myElement}_${todayElement}`;
  
  // 데이터 찾기 (없으면 기본값)
  return (fortuneData as any)[key] || {
    title: "Unknown Destiny",
    score: 50,
    desc: "The energies are mysterious today...",
    advice: "Stay calm."
  };
});

</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-gray-900 font-sans">
    
    <div class="mb-10 text-center">
      <h1 class="text-2xl font-bold tracking-tight mb-2 text-gray-900">Elemental Destiny</h1>
      <span class="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">MVP DEMO ver.</span>
    </div>

    <div class="w-full max-w-lg space-y-6">
      
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Birth Date
        </label>
        <input 
          type="date" 
          v-model="birthDate"
          class="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-lg font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all"
        />
      </div>

      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        
        <div class="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Your Identity</span>
          <span class="text-xs text-gray-400 font-mono">Day Pillar</span>
        </div>

        <div class="p-8 text-center">
          <div class="text-3xl font-bold text-gray-900 mb-2">
            {{ mySaju.day.gan.color }} {{ mySaju.day.ji.animal }}
          </div>
          
          <div class="inline-flex items-center space-x-2 mb-6">
            <span class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-semibold text-gray-600">
              {{ mySaju.day.gan.element }}
            </span>
            <span class="text-gray-300">/</span>
            <span class="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-semibold text-gray-600">
              {{ mySaju.day.ji.element }}
            </span>
          </div>

          <div class="text-gray-400 text-lg font-serif">
            {{ mySaju.day.gan.hanja }}{{ mySaju.day.ji.hanja }}
            <span class="text-sm text-gray-300 ml-1">({{ mySaju.day.gan.kor }}{{ mySaju.day.ji.kor }})</span>
          </div>
        </div>

        <div class="grid grid-cols-2 border-t border-gray-200 divide-x divide-gray-200 bg-gray-50">
          <div class="p-4 text-center">
            <span class="block text-[10px] uppercase text-gray-400 font-bold mb-1">Year (Zodiac)</span>
            <span class="block text-sm font-medium text-gray-700">
              {{ mySaju.year.gan.color }} {{ mySaju.year.ji.animal }}
            </span>
            <span class="block text-xs text-gray-400 mt-1">
              {{ mySaju.year.gan.hanja }}{{ mySaju.year.ji.hanja }}
            </span>
          </div>
          <div class="p-4 text-center">
            <span class="block text-[10px] uppercase text-gray-400 font-bold mb-1">Month</span>
            <span class="block text-sm font-medium text-gray-700">
              {{ mySaju.month.gan.color }} {{ mySaju.month.ji.animal }}
            </span>
            <span class="block text-xs text-gray-400 mt-1">
              {{ mySaju.month.gan.hanja }}{{ mySaju.month.ji.hanja }}
            </span>
          </div>
        </div>

      </div>

      <div class="bg-gray-900 text-white rounded-xl shadow-xl overflow-hidden relative transform transition-all hover:scale-[1.01]">
        <div class="bg-white/10 px-6 py-3 flex justify-between items-center">
          <span class="text-xs font-bold text-purple-300 uppercase tracking-widest">Today's Energy</span>
          <span class="text-xs text-gray-300 font-mono">{{ today.toLocaleDateString() }}</span>
        </div>

        <div class="p-8">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-3xl font-bold mt-2 text-white">{{ todayFortune.title }}</h2>
              <p class="text-sm text-gray-400 mt-1">
                {{ mySaju.day.gan.element }} meets {{ todaySaju.day.gan.element }}
              </p>
            </div>
            <div class="bg-white text-gray-900 px-4 py-2 rounded-lg text-2xl font-bold shadow-lg">
              {{ todayFortune.score }}
            </div>
          </div>
          
          <p class="text-gray-300 text-lg leading-relaxed mb-6 border-l-4 border-purple-500 pl-4">
            {{ todayFortune.desc }}
          </p>

          <div class="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <span class="text-gray-500 text-[10px] uppercase font-bold block mb-1">Action Advice</span>
            <p class="text-white font-medium">{{ todayFortune.advice }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>