<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, User, Check } from 'lucide-vue-next'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const agreeToTerms = ref(false)

const handleSignUp = async () => {
  if (password.value !== confirmPassword.value) { alert('Passwords do not match'); return }
  if (!agreeToTerms.value) { alert('Please agree to the terms'); return }
  isLoading.value = true
  await new Promise(r => setTimeout(r, 1500))
  isLoading.value = false
  router.push('/dashboard')
}

const goToLogin = () => router.push('/')

const features = [
  'Deploy your first agent in under 5 minutes',
  '50+ pre-built tool integrations',
  'SOC 2 Type II certified & GDPR ready',
  '99.9% uptime SLA, globally distributed',
]
</script>

<template>
  <component :is="'style'">
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');
    .font-display { font-family: 'DM Serif Display', Georgia, serif; }
    .font-geist   { font-family: 'Geist', system-ui, sans-serif; }
  </component>

  <div class="font-geist flex min-h-screen bg-[#0c1a0f] text-emerald-50 antialiased">

    <!-- ══ LEFT PANEL ══ -->
    <div class="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-shrink-0 relative overflow-hidden flex-col bg-[#091509] border-r border-emerald-900/60">

      <!-- Layered green blooms -->
      <div class="absolute -top-24 -left-16 w-[460px] h-[460px] rounded-full pointer-events-none"
        :style="{ background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, rgba(16,85,40,0.06) 40%, transparent 70%)', filter: 'blur(70px)' }" />
      <div class="absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full pointer-events-none"
        :style="{ background: 'radial-gradient(circle, rgba(20,83,45,0.5) 0%, transparent 65%)', filter: 'blur(60px)' }" />
      <div class="absolute top-1/2 right-1/4 w-48 h-48 rounded-full pointer-events-none"
        :style="{ background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)', filter: 'blur(30px)' }" />

      <!-- Grid -->
      <div class="absolute inset-0 pointer-events-none"
        :style="{
          backgroundImage: 'linear-gradient(rgba(74,222,128,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.04) 1px,transparent 1px)',
          backgroundSize: '56px 56px'
        }" />

      <!-- Geometric corners -->
      <div class="absolute top-0 left-0 w-52 h-52 border-b-2 border-r-2 border-emerald-700/30 rounded-br-[104px]" />
      <div class="absolute top-0 left-0 w-28 h-28 border-b border-r border-emerald-600/20 rounded-br-[56px]" />
      <div class="absolute bottom-0 right-0 w-44 h-44 border-t-2 border-l-2 border-emerald-700/20 rounded-tl-[88px]" />

      <div class="relative z-10 flex flex-col h-full p-12 xl:p-16">

        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-900/60">
            <Sparkles class="w-4 h-4 text-[#091509]" />
          </div>
          <span class="text-[15px] font-semibold tracking-tight text-emerald-50">AgentFlow</span>
        </div>

        <!-- Hero -->
        <div class="flex-1 flex flex-col justify-center space-y-10 py-16">

          <!-- Pill badge -->
          <div class="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border border-emerald-700/50 bg-emerald-950/60">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span class="text-[11px] font-medium tracking-[0.12em] uppercase text-emerald-400">Free 14-day trial</span>
          </div>

          <!-- Headline -->
          <div class="space-y-1">
            <h1 class="font-display text-[3.6rem] xl:text-[4.4rem] leading-[0.93] tracking-tight text-emerald-50">
              Start building
            </h1>
            <h1 class="font-display text-[3.6rem] xl:text-[4.4rem] leading-[0.93] tracking-tight italic text-emerald-400">
              your first agent.
            </h1>
          </div>

          <p class="text-[15px] text-emerald-200/45 leading-relaxed max-w-[340px] font-light">
            No credit card required. No engineers needed. Just sign up and start automating in minutes.
          </p>

          <!-- Feature list -->
          <div class="space-y-3.5">
            <div v-for="f in features" :key="f" class="flex items-center gap-3.5">
              <div class="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center">
                <Check class="w-3 h-3 text-emerald-400" />
              </div>
              <span class="text-[13px] text-emerald-300/70">{{ f }}</span>
            </div>
          </div>

          <!-- Testimonial -->
          <div class="pl-5 border-l-2 border-emerald-700/50 space-y-3 pt-1">
            <p class="text-[14px] text-emerald-200/50 leading-relaxed italic font-light">
              "We replaced three tools and a full-time contractor with two AgentFlow agents."
            </p>
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-full bg-emerald-800 border border-emerald-700/60 flex items-center justify-center">
                <span class="text-[10px] font-bold text-emerald-300">SC</span>
              </div>
              <div>
                <div class="text-[12px] text-emerald-200 font-medium">Sarah Chen</div>
                <div class="text-[11px] text-emerald-700">CTO, Meridian Labs</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom strip -->
        <div class="flex items-center gap-8 pt-8 border-t border-emerald-900/60">
          <div v-for="s in [{ n:'5k+', l:'Teams signed up' }, { n:'10k+', l:'Agents running' }, { n:'4.9★', l:'User rating' }]"
            :key="s.l">
            <div class="text-[20px] font-semibold text-emerald-300 tracking-tight">{{ s.n }}</div>
            <div class="text-[11px] text-emerald-700">{{ s.l }}</div>
          </div>
        </div>

      </div>
    </div>

    <!-- ══ RIGHT PANEL ══ -->
    <div class="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-[#0c1a0f] relative overflow-y-auto">

      <!-- Right panel atmosphere -->
      <div class="absolute inset-0 pointer-events-none"
        :style="{ background: 'radial-gradient(ellipse 70% 60% at 50% 35%, rgba(14,60,25,0.45) 0%, transparent 70%)' }" />
      <div class="absolute inset-0 pointer-events-none"
        :style="{
          backgroundImage: 'radial-gradient(circle, rgba(74,222,128,0.055) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }" />

      <!-- Mobile logo -->
      <div class="flex lg:hidden items-center gap-2.5 mb-10">
        <div class="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500">
          <Sparkles class="w-4 h-4 text-[#091509]" />
        </div>
        <span class="text-[15px] font-semibold tracking-tight text-emerald-50">AgentFlow</span>
      </div>

      <div class="relative z-10 w-full max-w-[400px]">

        <div class="mb-9">
          <h2 class="font-display text-[2.1rem] text-emerald-50 leading-tight mb-2">Create your account</h2>
          <p class="text-[14px] text-emerald-200/40 font-light">Join 5,000+ teams already building with AgentFlow.</p>
        </div>

        <form @submit.prevent="handleSignUp" class="space-y-4">

          <!-- Name -->
          <div class="space-y-1.5">
            <label class="block text-[11px] font-medium tracking-[0.12em] text-emerald-600 uppercase">Full name</label>
            <div class="relative group">
              <User class="absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-emerald-800 group-focus-within:text-emerald-400 transition-colors duration-200 pointer-events-none" />
              <input v-model="name" type="text" placeholder="Jane Smith" required
                class="w-full h-12 pl-11 pr-4 rounded-xl bg-emerald-950/50 border border-emerald-900/80 text-[14px] text-emerald-50 placeholder-emerald-900 outline-none transition-all duration-200 focus:border-emerald-500/60 focus:bg-emerald-950/80 focus:ring-1 focus:ring-emerald-500/25" />
            </div>
          </div>

          <!-- Email -->
          <div class="space-y-1.5">
            <label class="block text-[11px] font-medium tracking-[0.12em] text-emerald-600 uppercase">Email</label>
            <div class="relative group">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-emerald-800 group-focus-within:text-emerald-400 transition-colors duration-200 pointer-events-none" />
              <input v-model="email" type="email" placeholder="name@company.com" required
                class="w-full h-12 pl-11 pr-4 rounded-xl bg-emerald-950/50 border border-emerald-900/80 text-[14px] text-emerald-50 placeholder-emerald-900 outline-none transition-all duration-200 focus:border-emerald-500/60 focus:bg-emerald-950/80 focus:ring-1 focus:ring-emerald-500/25" />
            </div>
          </div>

          <!-- Password pair -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="block text-[11px] font-medium tracking-[0.12em] text-emerald-600 uppercase">Password</label>
              <div class="relative group">
                <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-emerald-800 group-focus-within:text-emerald-400 transition-colors duration-200 pointer-events-none" />
                <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Create" required
                  class="w-full h-12 pl-11 pr-10 rounded-xl bg-emerald-950/50 border border-emerald-900/80 text-[14px] text-emerald-50 placeholder-emerald-900 outline-none transition-all duration-200 focus:border-emerald-500/60 focus:bg-emerald-950/80 focus:ring-1 focus:ring-emerald-500/25" />
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-800 hover:text-emerald-500 transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center">
                  <EyeOff v-if="showPassword" class="w-[14px] h-[14px]" /><Eye v-else class="w-[14px] h-[14px]" />
                </button>
              </div>
            </div>

            <div class="space-y-1.5">
              <label class="block text-[11px] font-medium tracking-[0.12em] text-emerald-600 uppercase">Confirm</label>
              <div class="relative group">
                <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-emerald-800 group-focus-within:text-emerald-400 transition-colors duration-200 pointer-events-none" />
                <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm" required
                  class="w-full h-12 pl-11 pr-10 rounded-xl bg-emerald-950/50 border border-emerald-900/80 text-[14px] text-emerald-50 placeholder-emerald-900 outline-none transition-all duration-200 focus:border-emerald-500/60 focus:bg-emerald-950/80 focus:ring-1 focus:ring-emerald-500/25" />
                <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-800 hover:text-emerald-500 transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center">
                  <EyeOff v-if="showConfirmPassword" class="w-[14px] h-[14px]" /><Eye v-else class="w-[14px] h-[14px]" />
                </button>
              </div>
            </div>
          </div>

          <!-- Custom checkbox -->
          <label class="flex items-start gap-3 cursor-pointer pt-0.5">
            <div class="relative mt-0.5 flex-shrink-0 cursor-pointer">
              <input type="checkbox" v-model="agreeToTerms" class="sr-only peer" />
              <div class="w-4 h-4 rounded border border-emerald-800 bg-emerald-950/60 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all duration-150 flex items-center justify-center">
                <Check v-if="agreeToTerms" class="w-2.5 h-2.5 text-[#091509]" />
              </div>
            </div>
            <span class="text-[13px] text-emerald-700 leading-relaxed">
              I agree to the
              <a href="#" class="text-emerald-500 hover:text-emerald-300 transition-colors">Terms of Service</a>
              and
              <a href="#" class="text-emerald-500 hover:text-emerald-300 transition-colors">Privacy Policy</a>
            </span>
          </label>

          <!-- Submit -->
          <div class="pt-1">
            <button type="submit" :disabled="isLoading"
              class="group w-full h-12 flex items-center justify-center gap-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#091509] text-[14px] font-semibold border-none cursor-pointer transition-all duration-150 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_32px_rgba(52,211,153,0.2)] hover:shadow-[0_4px_40px_rgba(52,211,153,0.35)]">
              <span v-if="isLoading" class="flex items-center gap-2">
                <span class="w-4 h-4 rounded-full border-2 border-[#091509]/25 border-t-[#091509] animate-spin" />
                Creating account…
              </span>
              <template v-else>
                Get started free
                <ArrowRight class="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
              </template>
            </button>
          </div>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-4 my-6">
          <div class="flex-1 h-px bg-emerald-900/60" />
          <span class="text-[11px] font-medium text-emerald-800 tracking-widest uppercase">or</span>
          <div class="flex-1 h-px bg-emerald-900/60" />
        </div>

        <!-- OAuth -->
        <div class="grid grid-cols-2 gap-3">
          <button type="button"
            class="flex items-center justify-center gap-2.5 h-11 rounded-xl border border-emerald-900/70 bg-emerald-950/40 text-emerald-400/70 text-[13px] font-medium cursor-pointer transition-all duration-150 hover:bg-emerald-900/40 hover:border-emerald-800/80 hover:text-emerald-200">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button type="button"
            class="flex items-center justify-center gap-2.5 h-11 rounded-xl border border-emerald-900/70 bg-emerald-950/40 text-emerald-400/70 text-[13px] font-medium cursor-pointer transition-all duration-150 hover:bg-emerald-900/40 hover:border-emerald-800/80 hover:text-emerald-200">
            <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <p class="mt-8 text-center text-[13px] text-emerald-800">
          Already have an account?
          <button type="button" @click="goToLogin"
            class="ml-1 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors bg-transparent border-none cursor-pointer p-0">
            Sign in →
          </button>
        </p>
      </div>
    </div>

  </div>
</template>