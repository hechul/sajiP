<script setup lang="ts">
import { ref, computed } from 'vue';

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
// 기본값: 2002-07-13 (님 생일로 고정해두면 테스트하기 편합니다)
const birthDate = ref(getTodayLocal());

// 3. 계산 (Computed)
const mySaju = computed(() => {
  if (!birthDate.value) return getGanji(new Date());
  // 타임존 이슈 해결을 위한 T00:00:00 추가
  return getGanji(new Date(birthDate.value + 'T00:00:00'));
  // T00:00:00 -> 사용자의 PC 시간(로컬 시간) 기준으로 0시
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

      <p class="text-center text-xs text-gray-400 font-mono">
        Debug: {{ mySaju.day.gan.element }} Day Master
      </p>

    </div>
  </div>
</template>