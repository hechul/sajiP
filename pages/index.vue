<script setup lang="ts">
const {
  step,
  inputYear, inputMonth, inputDay,
  yearInputRef, monthInputRef, dayInputRef,
  yearHint, monthHint,
  mySaju, now,
  dailyFortune, monthlyFortune, yearlyFortune,
  goNext, reset
} = useFortune();
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#F9F6F0] to-[#EDE8DC] px-5 py-10 flex flex-col items-center">

    <!-- Header -->
    <div class="mb-12 text-center transition-all duration-700" :class="step === 4 ? 'scale-90 mb-6' : ''">
      <div class="text-4xl mb-2 opacity-80">命</div>
      <h1 class="text-2xl font-bold tracking-wider text-[#2C1810]" style="font-family: 'Noto Serif KR', serif;">Four Pillars</h1>
      <p v-if="step < 4" class="text-sm text-[#8B7355] mt-2 tracking-wide">Discover your destiny through ancient Eastern wisdom</p>
    </div>

    <div class="w-full max-w-md relative pb-20">

      <!-- Step 1: Year -->
      <transition name="fade">
        <div v-if="step === 1" class="bg-[#FFFEF9] p-8 rounded-lg shadow-lg border border-[#D4C5A9] text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B0000] via-[#C9A227] to-[#8B0000]"></div>
          <div class="absolute -top-4 -right-4 text-8xl text-[#F5E6D3] font-serif select-none opacity-50">年</div>
          <label class="relative z-10 block text-xs font-bold text-[#C9A227] tracking-widest mb-4">STEP ONE</label>
          <h2 class="relative z-10 text-xl font-bold text-[#2C1810] mb-6">What year were you born?</h2>
          <input
            ref="yearInputRef"
            type="text"
            inputmode="numeric"
            maxlength="4"
            v-model="inputYear"
            placeholder="e.g. 1990"
            class="relative z-10 w-full text-center text-4xl font-bold text-[#2C1810] border-b-2 border-[#D4C5A9] focus:border-[#8B0000] outline-none py-3 bg-transparent placeholder-[#D4C5A9] transition-colors"
            style="font-family: 'Noto Serif KR', serif;"
            @keyup.enter="goNext"
          />
          <div v-if="yearHint" class="relative z-10 mt-6 p-4 bg-[#FFF9E6] rounded-lg border border-[#E8D9A0]">
            <p class="text-sm text-[#5C4A32]">
              Year of the <span class="font-bold text-[#8B0000]">{{ yearHint }}</span>
            </p>
          </div>
          <button
            v-if="String(inputYear).length === 4"
            @click="goNext"
            class="relative z-10 mt-8 w-full bg-gradient-to-r from-[#8B0000] to-[#A52A2A] text-white py-4 rounded-lg font-bold text-lg hover:from-[#6B0000] hover:to-[#8B2222] transition-all shadow-md"
          >
            Continue
          </button>
        </div>
      </transition>

      <!-- Step 2: Month -->
      <transition name="fade">
        <div v-if="step === 2" class="bg-[#FFFEF9] p-8 rounded-lg shadow-lg border border-[#D4C5A9] text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B0000] via-[#C9A227] to-[#8B0000]"></div>
          <div class="absolute -top-4 -right-4 text-8xl text-[#F5E6D3] font-serif select-none opacity-50">月</div>
          <div class="relative z-10 text-[#8B7355] text-sm mb-4 cursor-pointer hover:text-[#8B0000] transition-colors" @click="step=1">← Back to {{ inputYear }}</div>
          <h2 class="relative z-10 text-xl font-bold text-[#2C1810] mb-6">What month?</h2>
          <input
            ref="monthInputRef"
            type="text"
            inputmode="numeric"
            maxlength="2"
            v-model="inputMonth"
            placeholder="e.g. 03"
            class="relative z-10 w-full text-center text-4xl font-bold text-[#2C1810] border-b-2 border-[#D4C5A9] focus:border-[#8B0000] outline-none py-3 bg-transparent placeholder-[#D4C5A9] transition-colors"
            style="font-family: 'Noto Serif KR', serif;"
            @keyup.enter="goNext"
          />
          <div v-if="monthHint" class="relative z-10 mt-6 p-4 bg-[#E8F4F0] rounded-lg border border-[#B8D4CC]">
            <p class="text-sm text-[#2C5545]">
              Born in <span class="font-bold">{{ monthHint.season }}</span><br>
              <span class="text-[#5C8A77]">{{ monthHint.desc }}</span>
            </p>
          </div>
          <button
            v-if="inputMonth"
            @click="goNext"
            class="relative z-10 mt-8 w-full bg-gradient-to-r from-[#8B0000] to-[#A52A2A] text-white py-4 rounded-lg font-bold text-lg hover:from-[#6B0000] hover:to-[#8B2222] transition-all shadow-md"
          >
            Continue
          </button>
        </div>
      </transition>

      <!-- Step 3: Day -->
      <transition name="fade">
        <div v-if="step === 3" class="bg-[#FFFEF9] p-8 rounded-lg shadow-lg border border-[#D4C5A9] text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B0000] via-[#C9A227] to-[#8B0000]"></div>
          <div class="absolute -top-4 -right-4 text-8xl text-[#F5E6D3] font-serif select-none opacity-50">日</div>
          <div class="relative z-10 text-[#8B7355] text-sm mb-4 cursor-pointer hover:text-[#8B0000] transition-colors" @click="step=2">← Back to Month</div>
          <h2 class="relative z-10 text-xl font-bold text-[#2C1810] mb-6">And the day?</h2>
          <input
            ref="dayInputRef"
            type="text"
            inputmode="numeric"
            maxlength="2"
            v-model="inputDay"
            placeholder="e.g. 15"
            class="relative z-10 w-full text-center text-4xl font-bold text-[#2C1810] border-b-2 border-[#D4C5A9] focus:border-[#8B0000] outline-none py-3 bg-transparent placeholder-[#D4C5A9] transition-colors"
            style="font-family: 'Noto Serif KR', serif;"
            @keyup.enter="goNext"
          />
          <button
            v-if="inputDay"
            @click="goNext"
            class="relative z-10 mt-8 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-[#2C1810] py-4 rounded-lg font-bold text-lg hover:from-[#B8922A] hover:to-[#C9A227] transition-all shadow-lg border border-[#A08520]"
          >
            Reveal My Destiny
          </button>
        </div>
      </transition>

      <!-- Step 4: Results -->
      <transition name="slide-up">
        <div v-if="step === 4 && mySaju" class="space-y-6">

          <!-- Day Master Card -->
          <div class="bg-[#FFFEF9] rounded-lg shadow-xl border border-[#D4C5A9] overflow-hidden">
            <div class="bg-gradient-to-r from-[#8B0000] via-[#A52A2A] to-[#8B0000] p-1"></div>
            <div class="p-6 text-center relative">
              <div class="absolute top-4 left-4 text-xs text-[#C9A227] font-bold tracking-widest">日柱</div>
              <span class="inline-block px-4 py-1 bg-[#8B0000] text-[#F5E6D3] rounded-full text-xs font-bold tracking-wider mb-4">Day Master</span>

              <div class="text-6xl font-bold text-[#2C1810] mb-3" style="font-family: 'Noto Serif KR', serif;">
                {{ mySaju.day.gan.hanja }}{{ mySaju.day.ji.hanja }}
              </div>

              <div class="text-xl font-semibold text-[#5C4A32] mb-4">
                {{ mySaju.day.gan.color }} {{ mySaju.day.ji.animal }}
              </div>

              <div class="flex justify-center items-center gap-3 mb-4">
                <span class="text-sm font-medium text-[#FFFEF9] bg-[#5C4A32] px-3 py-1 rounded-full">{{ mySaju.day.gan.element }}</span>
                <span class="text-[#C9A227] text-lg">•</span>
                <span class="text-sm font-medium text-[#FFFEF9] bg-[#5C4A32] px-3 py-1 rounded-full">{{ mySaju.day.ji.element }}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 divide-x divide-[#E8D9A0] bg-[#FFF9E6]">
              <div class="py-5 text-center">
                <span class="block text-xs text-[#8B7355] font-bold mb-2 tracking-wider">MONTH PILLAR · 月柱</span>
                <div class="text-2xl font-bold text-[#2C1810] mb-1" style="font-family: 'Noto Serif KR', serif;">
                  {{ mySaju.month.gan.hanja }}{{ mySaju.month.ji.hanja }}
                </div>
                <div class="text-sm text-[#5C4A32]">{{ mySaju.month.gan.color }} {{ mySaju.month.ji.animal }}</div>
              </div>
              <div class="py-5 text-center">
                <span class="block text-xs text-[#8B7355] font-bold mb-2 tracking-wider">YEAR PILLAR · 年柱</span>
                <div class="text-2xl font-bold text-[#2C1810] mb-1" style="font-family: 'Noto Serif KR', serif;">
                  {{ mySaju.year.gan.hanja }}{{ mySaju.year.ji.hanja }}
                </div>
                <div class="text-sm text-[#5C4A32]">{{ mySaju.year.gan.color }} {{ mySaju.year.ji.animal }}</div>
              </div>
            </div>

            <div class="bg-[#F5E6D3] text-center py-3">
               <button @click="reset" class="text-xs text-[#8B7355] hover:text-[#8B0000] transition-colors">Check another date</button>
            </div>
          </div>

          <!-- Daily Fortune -->
          <div class="bg-gradient-to-br from-[#2C1810] to-[#1A0F0A] text-white rounded-lg shadow-xl overflow-hidden relative p-6">
            <div class="absolute top-0 right-0 text-[120px] text-white/5 font-serif leading-none select-none">運</div>
            <div class="relative z-10">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <span class="text-xs font-bold text-[#C9A227] tracking-widest block mb-1">TODAY'S FORTUNE</span>
                  <span class="text-xs text-[#8B7355]">{{ now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}</span>
                  <h2 class="text-xl font-bold text-white mt-2 leading-tight">{{ dailyFortune?.title }}</h2>
                </div>
                <div class="bg-[#C9A227] rounded-lg px-3 py-2 text-center min-w-[50px]">
                  <span class="block text-xl font-bold text-[#2C1810] leading-none">{{ dailyFortune?.score }}</span>
                </div>
              </div>
              <p class="text-[#D4C5A9] text-sm leading-relaxed mb-4">{{ dailyFortune?.desc }}</p>
              <div class="bg-white/10 p-4 rounded-lg border border-white/10">
                <span class="text-xs text-[#C9A227] font-bold block mb-1">Guidance</span>
                <p class="text-white text-sm">{{ dailyFortune?.advice }}</p>
              </div>
            </div>
          </div>

          <!-- Monthly Fortune -->
          <div class="bg-[#FFFEF9] border border-[#D4C5A9] rounded-lg shadow-md p-6 relative overflow-hidden">
            <div class="absolute -top-2 -right-2 text-7xl text-[#E8F4F0] font-serif select-none">月</div>
            <div class="relative z-10">
              <span class="text-xs font-bold text-[#2C8B70] tracking-widest block mb-1">THIS MONTH</span>
              <h2 class="text-xl font-bold text-[#2C1810] mb-3">{{ monthlyFortune?.title }}</h2>
              <p class="text-[#5C4A32] text-sm leading-relaxed mb-4">{{ monthlyFortune?.desc }}</p>
              <div class="bg-[#E8F4F0] px-4 py-3 rounded-lg border border-[#B8D4CC]">
                <span class="text-xs text-[#2C8B70] font-bold">Tip: {{ monthlyFortune?.advice }}</span>
              </div>
            </div>
          </div>

          <!-- Yearly Fortune -->
          <div class="bg-[#FFFEF9] border border-[#D4C5A9] rounded-lg shadow-md p-6 relative overflow-hidden">
            <div class="absolute -top-2 -right-2 text-7xl text-[#F5E6F5] font-serif select-none">年</div>
            <div class="relative z-10">
              <span class="text-xs font-bold text-[#7B2D8E] tracking-widest block mb-1">THIS YEAR</span>
              <h2 class="text-xl font-bold text-[#2C1810] mb-3">{{ yearlyFortune?.title }}</h2>
              <p class="text-[#5C4A32] text-sm leading-relaxed mb-4">{{ yearlyFortune?.desc }}</p>
              <div class="bg-[#F5E6F5] px-4 py-3 rounded-lg border border-[#D4B8D8]">
                <span class="text-xs text-[#7B2D8E] font-bold">Tip: {{ yearlyFortune?.advice }}</span>
              </div>
            </div>
          </div>

        </div>
      </transition>

    </div>

    <!-- Footer -->
    <div class="mt-auto pt-8 text-center text-[#C9A227]/50 text-xs">
      ☯ Four Pillars of Destiny ☯
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');

.fade-enter-active, .fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-up-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.slide-up-leave-to {
  opacity: 0;
}
</style>