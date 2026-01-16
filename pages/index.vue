<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';

// 🌟 생성한 3개의 JSON 파일을 각각 가져옵니다.
import dayData from '@/assets/data/fortunes_day.json';
import monthData from '@/assets/data/fortunes_month.json';
import yearData from '@/assets/data/fortunes_year.json';

// 컴포저블
const { getGanji } = useSaju();

// --- 상태 관리 ---
const step = ref(1);
const inputYear = ref('');
const inputMonth = ref('');
const inputDay = ref('');

// DOM 포커스 제어용
const yearInputRef = ref<HTMLInputElement | null>(null);
const monthInputRef = ref<HTMLInputElement | null>(null);
const dayInputRef = ref<HTMLInputElement | null>(null);

onMounted(() => { yearInputRef.value?.focus(); });

// --- 힌트 로직 ---

// 1. 연도 힌트 (띠 미리보기)
const yearHint = computed(() => {
  if (!inputYear.value || String(inputYear.value).length < 4) return '';
  const y = parseInt(inputYear.value);
  // 해당 년도의 중간쯤(6월)으로 임시 날짜를 생성해 띠를 확인
  const tempSaju = getGanji(new Date(y, 5, 15));
  return `${tempSaju.year.gan.color} ${tempSaju.year.ji.animal}`; 
});

// 2. 월 힌트 (계절/환절기)
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

// --- ✨ 핵심 사주 로직 ---

// 1. 내 사주 계산 (요청하신 안전한 Date 로직 적용)
const mySaju = computed(() => {
  if (step.value < 4) return null;
  
  const y = parseInt(inputYear.value);
  const m = parseInt(inputMonth.value) - 1; // 자바스크립트 월은 0부터 시작 (0~11)
  const d = parseInt(inputDay.value);
  
  // 시간은 낮 12시로 고정하여 타임존/자정 이슈 방지
  const safeDate = new Date(y, m, d, 12, 0, 0);
  return getGanji(safeDate);
});

// 2. 현재 시점 사주
const now = new Date();
const currentSaju = getGanji(now);

// 3. 운세 매칭 함수 (데이터 소스 분리 적용)
const getFortune = (myPillar: any, targetPillar: any, dataSource: any) => {
  const myStem = myPillar.gan.element;
  const myBranch = myPillar.ji.element;
  const targetStem = targetPillar.gan.element;
  const targetBranch = targetPillar.ji.element;

  // Key 생성: 내천간_내지지_vs_남천간_남지지
  const complexKey = `${myStem}_${myBranch}_vs_${targetStem}_${targetBranch}`;

  if (dataSource[complexKey]) {
    return dataSource[complexKey];
  }
  
  // 데이터가 없을 경우 Fallback
  return { title: "Analyzing...", score: 50, desc: "Reading the energy flow...", advice: "Stay calm." };
};

// (1) 오늘의 운세 -> dayData
const dailyFortune = computed(() => {
  if (!mySaju.value) return null;
  return getFortune(mySaju.value.day, currentSaju.day, dayData);
});

// (2) 이달의 운세 -> monthData
const monthlyFortune = computed(() => {
  if (!mySaju.value) return null;
  return getFortune(mySaju.value.month, currentSaju.month, monthData);
});

// (3) 올해의 운세 -> yearData
const yearlyFortune = computed(() => {
  if (!mySaju.value) return null;
  return getFortune(mySaju.value.year, currentSaju.year, yearData);
});

// --- 네비게이션 ---
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
</script>

<template>
  <div class="min-h-screen bg-[#F5F7FA] px-5 py-8 font-sans flex flex-col items-center">
    
    <div class="mb-10 text-center transition-all duration-500" :class="step === 4 ? 'scale-75 mb-4' : ''">
      <h1 class="text-xl font-bold tracking-tight text-gray-900">Elemental Destiny</h1>
      <p v-if="step < 4" class="text-xs text-gray-500 mt-1">Let's find your barcode.</p>
    </div>

    <div class="w-full max-w-md relative pb-20">

      <transition name="fade">
        <div v-if="step === 1" class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Step 1. Year</label>
          <h2 class="text-xl font-bold text-gray-800 mb-6">Which year were you born?</h2>
          <input ref="yearInputRef" type="text" inputmode="numeric" maxlength="4" v-model="inputYear" placeholder="YYYY" class="w-full text-center text-4xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-gray-900 outline-none py-2 bg-transparent placeholder-gray-200 transition-colors" @keyup.enter="goNext" />
          <div v-if="yearHint" class="mt-6 p-3 bg-gray-50 rounded-lg animate-pulse"><p class="text-sm text-gray-600">Ah, {{ inputYear }}! <br>Likely the year of <span class="font-bold text-gray-900">{{ yearHint }}</span>.</p></div>
          <button v-if="String(inputYear).length === 4" @click="goNext" class="mt-8 w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors">Next</button>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="step === 2" class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div class="text-gray-400 text-sm mb-4 cursor-pointer" @click="step=1">← Back to {{ inputYear }}</div>
          <h2 class="text-xl font-bold text-gray-800 mb-6">And the month?</h2>
          <input ref="monthInputRef" type="text" inputmode="numeric" maxlength="2" v-model="inputMonth" placeholder="MM" class="w-full text-center text-4xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-gray-900 outline-none py-2 bg-transparent placeholder-gray-200 transition-colors" @keyup.enter="goNext" />
          <div v-if="monthHint" class="mt-6 p-3 bg-blue-50 rounded-lg"><p class="text-sm text-blue-800">Born in <b>{{ monthHint.season }}</b>.<br>{{ monthHint.desc }}</p></div>
          <button v-if="inputMonth" @click="goNext" class="mt-8 w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors">Next</button>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="step === 3" class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div class="text-gray-400 text-sm mb-4 cursor-pointer" @click="step=2">← Back to Month</div>
          <h2 class="text-xl font-bold text-gray-800 mb-6">Finally, the day?</h2>
          <input ref="dayInputRef" type="text" inputmode="numeric" maxlength="2" v-model="inputDay" placeholder="DD" class="w-full text-center text-4xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-gray-900 outline-none py-2 bg-transparent placeholder-gray-200 transition-colors" @keyup.enter="goNext" />
          <p class="mt-4 text-xs text-gray-400">This will reveal your Year Pillar (Zodiac).</p>
          <button v-if="inputDay" @click="goNext" class="mt-8 w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg">Reveal My Destiny ✨</button>
        </div>
      </transition>

      <transition name="slide-up">
        <div v-if="step === 4 && mySaju" class="space-y-6">
          
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 text-center p-6">
             <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Identity</div>
             <div class="text-2xl font-extrabold text-gray-900">
               {{ mySaju.year.gan.color }} {{ mySaju.year.ji.animal }}
             </div>
             <div class="text-4xl text-gray-800 font-serif my-2 opacity-90">
                {{ mySaju.year.gan.hanja }}{{ mySaju.year.ji.hanja }}
             </div>
             <button @click="reset" class="mt-2 text-[10px] text-gray-400 underline">Check another date</button>
          </div>

          <div class="bg-[#1A1F2C] text-white rounded-2xl shadow-xl overflow-hidden relative p-6 transform transition hover:scale-[1.01]">
            <div class="flex justify-between items-start mb-4">
              <div>
                <span class="text-[10px] font-bold text-green-400 uppercase tracking-widest block mb-1">Daily Forecast</span>
                <span class="text-xs text-gray-500 font-mono">{{ now.toLocaleDateString() }}</span>
                <h2 class="text-xl font-bold text-white mt-1 leading-tight">{{ dailyFortune?.title }}</h2>
              </div>
              <div class="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 backdrop-blur-sm text-center">
                <span class="block text-xl font-bold text-white leading-none">{{ dailyFortune?.score }}</span>
              </div>
            </div>
            <p class="text-gray-300 text-sm leading-relaxed mb-4">
              {{ dailyFortune?.desc }}
            </p>
            <div class="bg-white/5 p-3 rounded-lg border border-white/10">
               <span class="text-[10px] text-gray-500 uppercase font-bold block">Advice</span>
               <p class="text-white text-xs font-medium">{{ dailyFortune?.advice }}</p>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
            <div class="relative z-10">
              <span class="text-[10px] font-bold text-blue-500 uppercase tracking-widest block mb-1">Monthly Forecast</span>
              <h2 class="text-xl font-bold text-gray-900 mb-2">{{ monthlyFortune?.title }}</h2>
              <p class="text-gray-600 text-sm leading-relaxed mb-3">
                {{ monthlyFortune?.desc }}
              </p>
              <p class="text-xs font-bold text-gray-800 bg-gray-50 inline-block px-2 py-1 rounded">
                💡 {{ monthlyFortune?.advice }}
              </p>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-16 h-16 bg-purple-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
            <div class="relative z-10">
              <span class="text-[10px] font-bold text-purple-500 uppercase tracking-widest block mb-1">Yearly Forecast</span>
              <h2 class="text-xl font-bold text-gray-900 mb-2">{{ yearlyFortune?.title }}</h2>
              <p class="text-gray-600 text-sm leading-relaxed mb-3">
                {{ yearlyFortune?.desc }}
              </p>
              <p class="text-xs font-bold text-gray-800 bg-gray-50 inline-block px-2 py-1 rounded">
                💡 {{ yearlyFortune?.advice }}
              </p>
            </div>
          </div>

        </div>
      </transition>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active { transition: all 0.5s ease-out; }
.slide-up-enter-from { opacity: 0; transform: translateY(20px); }
.slide-up-leave-to { opacity: 0; }
</style>