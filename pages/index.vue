<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue';

// 🌟 데이터 파일 가져오기
import dayData from '@/assets/data/fortunes_day.json';
import monthData from '@/assets/data/fortunes_month.json';
import yearData from '@/assets/data/fortunes_year.json';

const { getGanji } = useSaju();

// --- 상태 관리 ---
const step = ref(1);
const inputYear = ref('');
const inputMonth = ref('');
const inputDay = ref('');

// DOM Ref
const yearInputRef = ref<HTMLInputElement | null>(null);
const monthInputRef = ref<HTMLInputElement | null>(null);
const dayInputRef = ref<HTMLInputElement | null>(null);

onMounted(() => { yearInputRef.value?.focus(); });

// 힌트 로직
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

// --- ✨ 핵심 로직 ---

const mySaju = computed(() => {
  if (step.value < 4) return null;
  const y = parseInt(inputYear.value);
  const m = parseInt(inputMonth.value) - 1;
  const d = parseInt(inputDay.value);
  return getGanji(new Date(y, m, d, 12, 0, 0));
});

// 오늘 날짜 고정
const now = new Date();
now.setHours(12, 0, 0, 0); 
const currentSaju = getGanji(now);

// 디버깅용 키
const debugKey = ref('');

const getFortune = (myPillar: any, targetPillar: any, dataSource: any, type: string) => {
  const myStem = myPillar.gan.element;
  const myBranch = myPillar.ji.element;
  const targetStem = targetPillar.gan.element;
  const targetBranch = targetPillar.ji.element;

  const complexKey = `${myStem}_${myBranch}_vs_${targetStem}_${targetBranch}`;
  
  if (type === 'day') debugKey.value = complexKey;

  if (dataSource[complexKey]) {
    return dataSource[complexKey];
  }
  
  return { title: "Analyzing...", score: 50, desc: "Reading the energy flow...", advice: "Stay calm." };
};

const dailyFortune = computed(() => {
  if (!mySaju.value) return null;
  return getFortune(mySaju.value.day, currentSaju.day, dayData, 'day');
});

const monthlyFortune = computed(() => {
  if (!mySaju.value) return null;
  return getFortune(mySaju.value.month, currentSaju.month, monthData, 'month');
});

const yearlyFortune = computed(() => {
  if (!mySaju.value) return null;
  return getFortune(mySaju.value.year, currentSaju.year, yearData, 'year');
});

const goNext = async () => {
  const yLen = String(inputYear.value).length;
  if (step.value === 1 && yLen === 4) { step.value = 2; await nextTick(); monthInputRef.value?.focus(); } 
  else if (step.value === 2 && inputMonth.value) { step.value = 3; await nextTick(); dayInputRef.value?.focus(); } 
  else if (step.value === 3 && inputDay.value) { step.value = 4; }
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
          <button v-if="String(inputYear).length === 4" @click="goNext" class="mt-8 w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors">Next</button>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="step === 2" class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div class="text-gray-400 text-sm mb-4 cursor-pointer" @click="step=1">← Back to {{ inputYear }}</div>
          <h2 class="text-xl font-bold text-gray-800 mb-6">And the month?</h2>
          <input ref="monthInputRef" type="text" inputmode="numeric" maxlength="2" v-model="inputMonth" placeholder="MM" class="w-full text-center text-4xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-gray-900 outline-none py-2 bg-transparent placeholder-gray-200 transition-colors" @keyup.enter="goNext" />
          <button v-if="inputMonth" @click="goNext" class="mt-8 w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors">Next</button>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="step === 3" class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div class="text-gray-400 text-sm mb-4 cursor-pointer" @click="step=2">← Back to Month</div>
          <h2 class="text-xl font-bold text-gray-800 mb-6">Finally, the day?</h2>
          <input ref="dayInputRef" type="text" inputmode="numeric" maxlength="2" v-model="inputDay" placeholder="DD" class="w-full text-center text-4xl font-bold text-gray-900 border-b-2 border-gray-200 focus:border-gray-900 outline-none py-2 bg-transparent placeholder-gray-200 transition-colors" @keyup.enter="goNext" />
          <button v-if="inputDay" @click="goNext" class="mt-8 w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg">Reveal My Destiny ✨</button>
        </div>
      </transition>

      <transition name="slide-up">
        <div v-if="step === 4 && mySaju" class="space-y-6">
          
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 text-center border-b border-gray-100">
              <span class="inline-block px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                Your Day Master (Self)
              </span>
              
              <div class="text-3xl font-extrabold text-gray-900 mb-2">
                {{ mySaju.day.gan.color }} {{ mySaju.day.ji.animal }}
              </div>

              <div class="flex justify-center items-center space-x-2 mb-4">
                <span class="text-sm font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  {{ mySaju.day.gan.element }}
                </span>
                <span class="text-gray-300">/</span>
                <span class="text-sm font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  {{ mySaju.day.ji.element }}
                </span>
              </div>

              <div class="text-5xl text-gray-800 font-serif opacity-90">
                {{ mySaju.day.gan.hanja }}{{ mySaju.day.ji.hanja }}
              </div>
            </div>

            <div class="grid grid-cols-2 divide-x divide-gray-100 bg-gray-50/50">
              <div class="py-4 text-center">
                <span class="block text-[10px] text-gray-400 uppercase font-bold mb-1">Month (Environment)</span>
                <div class="text-sm font-semibold text-gray-700">
                  {{ mySaju.month.gan.color }} {{ mySaju.month.ji.animal }}
                </div>
                <div class="text-lg font-serif text-gray-400 mt-1">
                  {{ mySaju.month.gan.hanja }}{{ mySaju.month.ji.hanja }}
                </div>
              </div>
              <div class="py-4 text-center">
                <span class="block text-[10px] text-gray-400 uppercase font-bold mb-1">Year (Zodiac)</span>
                <div class="text-sm font-semibold text-gray-700">
                  {{ mySaju.year.gan.color }} {{ mySaju.year.ji.animal }}
                </div>
                <div class="text-lg font-serif text-gray-400 mt-1">
                  {{ mySaju.year.gan.hanja }}{{ mySaju.year.ji.hanja }}
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 text-center pb-4">
               <button @click="reset" class="text-[10px] text-gray-400 underline hover:text-gray-600">Check another date</button>
            </div>
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