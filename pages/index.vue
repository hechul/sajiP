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

// 운세 탭 상태
const fortuneTab = ref<'daily' | 'monthly' | 'yearly'>('daily');

// 공유 기능
const shareResult = async () => {
  if (!mySaju.value) return;

  const shareText = `My Four Pillars: ${mySaju.value.day.gan.color} ${mySaju.value.day.ji.animal} (${mySaju.value.day.gan.hanja}${mySaju.value.day.ji.hanja})\n\nDiscover yours at Four Pillars of Destiny!`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My Four Pillars Reading',
        text: shareText,
      });
    } catch (e) {
      // User cancelled or error
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(shareText);
    alert('Copied to clipboard!');
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#F9F6F0] to-[#EDE8DC] px-4 py-6 flex flex-col items-center">

    <!-- Header -->
    <div class="mb-8 text-center transition-all duration-700" :class="step === 4 ? 'scale-90 mb-4' : ''">
      <div class="text-5xl mb-3 opacity-80">命</div>
      <h1 class="text-2xl font-bold tracking-wider text-[#2C1810]" style="font-family: 'Noto Serif KR', serif;">Four Pillars</h1>
      <p v-if="step < 4" class="text-sm text-[#8B7355] mt-2 tracking-wide max-w-[280px] mx-auto">Discover your destiny through ancient Eastern wisdom</p>
    </div>

    <!-- Progress Indicator -->
    <div v-if="step < 4" class="w-full max-w-md mb-6">
      <div class="flex justify-center items-center gap-2 mb-2">
        <div
          v-for="i in 3"
          :key="i"
          class="h-1.5 rounded-full transition-all duration-500"
          :class="[
            i <= step ? 'bg-[#8B0000]' : 'bg-[#D4C5A9]',
            i === step ? 'w-8' : 'w-4'
          ]"
        ></div>
      </div>
      <p class="text-center text-xs text-[#8B7355]">Step {{ step }} of 3</p>
    </div>

    <div class="w-full max-w-md relative pb-8">

      <!-- Step 1: Year -->
      <transition name="fade">
        <div v-if="step === 1" class="bg-[#FFFEF9] p-6 sm:p-8 rounded-2xl shadow-lg border border-[#D4C5A9] text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B0000] via-[#C9A227] to-[#8B0000]"></div>
          <div class="absolute -top-4 -right-4 text-8xl text-[#F5E6D3] font-serif select-none opacity-50">年</div>

          <div class="relative z-10">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FFF9E6] flex items-center justify-center">
              <span class="text-3xl">🐉</span>
            </div>

            <h2 class="text-xl font-bold text-[#2C1810] mb-2">Birth Year</h2>
            <p class="text-sm text-[#8B7355] mb-6">Enter the year you were born</p>

            <input
              ref="yearInputRef"
              type="text"
              inputmode="numeric"
              maxlength="4"
              v-model="inputYear"
              placeholder="1990"
              class="w-full text-center text-5xl font-bold text-[#2C1810] border-b-2 border-[#D4C5A9] focus:border-[#8B0000] outline-none py-4 bg-transparent placeholder-[#E8D9A0] transition-colors tracking-widest"
              style="font-family: 'Noto Serif KR', serif;"
              @keyup.enter="goNext"
            />

            <transition name="hint">
              <div v-if="yearHint" class="mt-6 p-4 bg-[#FFF9E6] rounded-xl border border-[#E8D9A0]">
                <p class="text-sm text-[#5C4A32]">
                  Likely the <span class="font-bold text-[#8B0000]">{{ yearHint }}</span>
                </p>
                <p class="text-xs text-[#8B7355] mt-1">* Exact sign depends on lunar calendar</p>
              </div>
            </transition>

            <button
              v-if="String(inputYear).length === 4"
              @click="goNext"
              class="mt-6 w-full bg-gradient-to-r from-[#8B0000] to-[#A52A2A] text-white py-4 rounded-xl font-bold text-lg hover:from-[#6B0000] hover:to-[#8B2222] transition-all shadow-md active:scale-[0.98]"
            >
              Continue
            </button>
          </div>
        </div>
      </transition>

      <!-- Step 2: Month -->
      <transition name="fade">
        <div v-if="step === 2" class="bg-[#FFFEF9] p-6 sm:p-8 rounded-2xl shadow-lg border border-[#D4C5A9] text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B0000] via-[#C9A227] to-[#8B0000]"></div>
          <div class="absolute -top-4 -right-4 text-8xl text-[#F5E6D3] font-serif select-none opacity-50">月</div>

          <div class="relative z-10">
            <button
              @click="step=1"
              class="absolute top-0 left-0 text-[#8B7355] text-sm flex items-center gap-1 hover:text-[#8B0000] transition-colors p-2 -m-2"
            >
              <span>←</span> {{ inputYear }}
            </button>

            <div class="w-16 h-16 mx-auto mb-4 mt-4 rounded-full bg-[#E8F4F0] flex items-center justify-center">
              <span class="text-3xl">🌙</span>
            </div>

            <h2 class="text-xl font-bold text-[#2C1810] mb-2">Birth Month</h2>
            <p class="text-sm text-[#8B7355] mb-6">Which month were you born?</p>

            <input
              ref="monthInputRef"
              type="text"
              inputmode="numeric"
              maxlength="2"
              v-model="inputMonth"
              placeholder="03"
              class="w-full text-center text-5xl font-bold text-[#2C1810] border-b-2 border-[#D4C5A9] focus:border-[#8B0000] outline-none py-4 bg-transparent placeholder-[#E8D9A0] transition-colors tracking-widest"
              style="font-family: 'Noto Serif KR', serif;"
              @keyup.enter="goNext"
            />

            <transition name="hint">
              <div v-if="monthHint" class="mt-6 p-4 bg-[#E8F4F0] rounded-xl border border-[#B8D4CC]">
                <p class="text-sm text-[#2C5545]">
                  <span class="font-bold">{{ monthHint.season }}</span>
                </p>
                <p class="text-xs text-[#5C8A77] mt-1">{{ monthHint.desc }}</p>
              </div>
            </transition>

            <button
              v-if="inputMonth"
              @click="goNext"
              class="mt-6 w-full bg-gradient-to-r from-[#8B0000] to-[#A52A2A] text-white py-4 rounded-xl font-bold text-lg hover:from-[#6B0000] hover:to-[#8B2222] transition-all shadow-md active:scale-[0.98]"
            >
              Continue
            </button>
          </div>
        </div>
      </transition>

      <!-- Step 3: Day -->
      <transition name="fade">
        <div v-if="step === 3" class="bg-[#FFFEF9] p-6 sm:p-8 rounded-2xl shadow-lg border border-[#D4C5A9] text-center relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B0000] via-[#C9A227] to-[#8B0000]"></div>
          <div class="absolute -top-4 -right-4 text-8xl text-[#F5E6D3] font-serif select-none opacity-50">日</div>

          <div class="relative z-10">
            <button
              @click="step=2"
              class="absolute top-0 left-0 text-[#8B7355] text-sm flex items-center gap-1 hover:text-[#8B0000] transition-colors p-2 -m-2"
            >
              <span>←</span> Month
            </button>

            <div class="w-16 h-16 mx-auto mb-4 mt-4 rounded-full bg-[#FFF0E6] flex items-center justify-center">
              <span class="text-3xl">☀️</span>
            </div>

            <h2 class="text-xl font-bold text-[#2C1810] mb-2">Birth Day</h2>
            <p class="text-sm text-[#8B7355] mb-6">The final piece of your destiny</p>

            <input
              ref="dayInputRef"
              type="text"
              inputmode="numeric"
              maxlength="2"
              v-model="inputDay"
              placeholder="15"
              class="w-full text-center text-5xl font-bold text-[#2C1810] border-b-2 border-[#D4C5A9] focus:border-[#8B0000] outline-none py-4 bg-transparent placeholder-[#E8D9A0] transition-colors tracking-widest"
              style="font-family: 'Noto Serif KR', serif;"
              @keyup.enter="goNext"
            />

            <button
              v-if="inputDay"
              @click="goNext"
              class="mt-8 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-[#2C1810] py-4 rounded-xl font-bold text-lg hover:from-[#B8922A] hover:to-[#C9A227] transition-all shadow-lg border border-[#A08520] active:scale-[0.98]"
            >
              Reveal My Destiny ✨
            </button>
          </div>
        </div>
      </transition>

      <!-- Step 4: Results -->
      <transition name="slide-up">
        <div v-if="step === 4 && mySaju" class="space-y-4">

          <!-- Day Master Card -->
          <div class="bg-[#FFFEF9] rounded-2xl shadow-xl border border-[#D4C5A9] overflow-hidden">
            <div class="bg-gradient-to-r from-[#8B0000] via-[#A52A2A] to-[#8B0000] p-1"></div>
            <div class="p-5 text-center relative">
              <div class="absolute top-3 left-3 text-xs text-[#C9A227] font-bold tracking-widest">日柱</div>

              <!-- Share button -->
              <button
                @click="shareResult"
                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#F5E6D3] flex items-center justify-center hover:bg-[#E8D9A0] transition-colors active:scale-95"
              >
                <svg class="w-4 h-4 text-[#8B7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                </svg>
              </button>

              <span class="inline-block px-4 py-1.5 bg-[#8B0000] text-[#F5E6D3] rounded-full text-xs font-bold tracking-wider mb-3">Your Day Master</span>

              <div class="text-6xl font-bold text-[#2C1810] mb-2" style="font-family: 'Noto Serif KR', serif;">
                {{ mySaju.day.gan.hanja }}{{ mySaju.day.ji.hanja }}
              </div>

              <div class="text-lg font-semibold text-[#5C4A32] mb-3">
                {{ mySaju.day.gan.color }} {{ mySaju.day.ji.animal }}
              </div>

              <div class="flex justify-center items-center gap-2 mb-2">
                <span class="text-xs font-medium text-[#FFFEF9] bg-[#5C4A32] px-3 py-1 rounded-full">{{ mySaju.day.gan.element }}</span>
                <span class="text-[#C9A227]">•</span>
                <span class="text-xs font-medium text-[#FFFEF9] bg-[#5C4A32] px-3 py-1 rounded-full">{{ mySaju.day.ji.element }}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 divide-x divide-[#E8D9A0] bg-[#FFF9E6]">
              <div class="py-4 text-center">
                <span class="block text-[10px] text-[#8B7355] font-bold mb-1 tracking-wider">MONTH · 月柱</span>
                <div class="text-xl font-bold text-[#2C1810]" style="font-family: 'Noto Serif KR', serif;">
                  {{ mySaju.month.gan.hanja }}{{ mySaju.month.ji.hanja }}
                </div>
                <div class="text-xs text-[#5C4A32]">{{ mySaju.month.gan.color }} {{ mySaju.month.ji.animal }}</div>
              </div>
              <div class="py-4 text-center">
                <span class="block text-[10px] text-[#8B7355] font-bold mb-1 tracking-wider">YEAR · 年柱</span>
                <div class="text-xl font-bold text-[#2C1810]" style="font-family: 'Noto Serif KR', serif;">
                  {{ mySaju.year.gan.hanja }}{{ mySaju.year.ji.hanja }}
                </div>
                <div class="text-xs text-[#5C4A32]">{{ mySaju.year.gan.color }} {{ mySaju.year.ji.animal }}</div>
              </div>
            </div>
          </div>

          <!-- Fortune Tabs -->
          <div class="bg-[#FFFEF9] rounded-2xl shadow-lg border border-[#D4C5A9] overflow-hidden">
            <!-- Tab Navigation -->
            <div class="flex border-b border-[#E8D9A0]">
              <button
                @click="fortuneTab = 'daily'"
                class="flex-1 py-3 text-sm font-bold transition-all relative"
                :class="fortuneTab === 'daily' ? 'text-[#8B0000]' : 'text-[#8B7355]'"
              >
                Today
                <div v-if="fortuneTab === 'daily'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#8B0000] rounded-full"></div>
              </button>
              <button
                @click="fortuneTab = 'monthly'"
                class="flex-1 py-3 text-sm font-bold transition-all relative"
                :class="fortuneTab === 'monthly' ? 'text-[#2C8B70]' : 'text-[#8B7355]'"
              >
                This Month
                <div v-if="fortuneTab === 'monthly'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#2C8B70] rounded-full"></div>
              </button>
              <button
                @click="fortuneTab = 'yearly'"
                class="flex-1 py-3 text-sm font-bold transition-all relative"
                :class="fortuneTab === 'yearly' ? 'text-[#7B2D8E]' : 'text-[#8B7355]'"
              >
                This Year
                <div v-if="fortuneTab === 'yearly'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#7B2D8E] rounded-full"></div>
              </button>
            </div>

            <!-- Tab Content -->
            <div class="p-5 min-h-[200px]">
              <!-- Daily Fortune -->
              <transition name="tab" mode="out-in">
                <div v-if="fortuneTab === 'daily'" key="daily">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <span class="text-xs text-[#8B7355]">{{ now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</span>
                      <h3 class="text-lg font-bold text-[#2C1810] mt-1">{{ dailyFortune?.title }}</h3>
                    </div>
                    <div class="bg-gradient-to-br from-[#8B0000] to-[#A52A2A] rounded-xl px-3 py-2 text-center min-w-[50px]">
                      <span class="block text-xl font-bold text-white leading-none">{{ dailyFortune?.score }}</span>
                    </div>
                  </div>
                  <p class="text-[#5C4A32] text-sm leading-relaxed mb-4">{{ dailyFortune?.desc }}</p>
                  <div class="bg-[#FFF9E6] p-3 rounded-xl border border-[#E8D9A0]">
                    <span class="text-xs text-[#C9A227] font-bold block mb-1">💡 Guidance</span>
                    <p class="text-[#5C4A32] text-sm">{{ dailyFortune?.advice }}</p>
                  </div>
                </div>
              </transition>

              <!-- Monthly Fortune -->
              <transition name="tab" mode="out-in">
                <div v-if="fortuneTab === 'monthly'" key="monthly">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <span class="text-xs text-[#8B7355]">{{ now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }}</span>
                      <h3 class="text-lg font-bold text-[#2C1810] mt-1">{{ monthlyFortune?.title }}</h3>
                    </div>
                  </div>
                  <p class="text-[#5C4A32] text-sm leading-relaxed mb-4">{{ monthlyFortune?.desc }}</p>
                  <div class="bg-[#E8F4F0] p-3 rounded-xl border border-[#B8D4CC]">
                    <span class="text-xs text-[#2C8B70] font-bold block mb-1">💡 Tip</span>
                    <p class="text-[#2C5545] text-sm">{{ monthlyFortune?.advice }}</p>
                  </div>
                </div>
              </transition>

              <!-- Yearly Fortune -->
              <transition name="tab" mode="out-in">
                <div v-if="fortuneTab === 'yearly'" key="yearly">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <span class="text-xs text-[#8B7355]">{{ now.getFullYear() }}</span>
                      <h3 class="text-lg font-bold text-[#2C1810] mt-1">{{ yearlyFortune?.title }}</h3>
                    </div>
                  </div>
                  <p class="text-[#5C4A32] text-sm leading-relaxed mb-4">{{ yearlyFortune?.desc }}</p>
                  <div class="bg-[#F5E6F5] p-3 rounded-xl border border-[#D4B8D8]">
                    <span class="text-xs text-[#7B2D8E] font-bold block mb-1">💡 Insight</span>
                    <p class="text-[#5C3D6E] text-sm">{{ yearlyFortune?.advice }}</p>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- Reset Button -->
          <button
            @click="reset"
            class="w-full py-3 text-[#8B7355] text-sm font-medium hover:text-[#8B0000] transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Check another date
          </button>

        </div>
      </transition>

    </div>

    <!-- Footer -->
    <div class="mt-auto pt-6 text-center text-[#C9A227]/50 text-xs">
      ☯ Four Pillars of Destiny ☯
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap');

/* Fade transition */
.fade-enter-active, .fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Slide up transition */
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

/* Hint transition */
.hint-enter-active, .hint-leave-active {
  transition: all 0.3s ease;
}
.hint-enter-from, .hint-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Tab transition */
.tab-enter-active, .tab-leave-active {
  transition: all 0.2s ease;
}
.tab-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.tab-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* Better touch targets */
button {
  -webkit-tap-highlight-color: transparent;
}

input {
  -webkit-tap-highlight-color: transparent;
  caret-color: #8B0000;
}

/* Prevent zoom on input focus (iOS) */
@media screen and (max-width: 768px) {
  input {
    font-size: 16px !important;
  }
}
</style>
