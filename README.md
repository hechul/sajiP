📚 References & Tech Stack
1. Core Framework & Language
프로젝트의 뼈대가 되는 핵심 기술입니다.

Nuxt 3 (Full-stack Framework)

Usage: 웹 애플리케이션의 전반적인 구조 설계, 라우팅, SSR(Server Side Rendering) 및 SEO 최적화를 위해 사용.

Docs: https://nuxt.com

Vue.js 3 (Composition API)

Usage: setup() 문법과 ref, computed, watch 등 반응형 상태 관리를 통한 모듈형 컴포넌트 개발.

Docs: https://vuejs.org

TypeScript (v5.x)

Usage: 사주 데이터(Ganji, Element)와 날짜 객체의 엄격한 타입 지정을 통해 런타임 오류 방지 및 개발 안정성 확보.

Docs: https://www.typescriptlang.org

2. External Libraries (Open Source)
직접 구현하기 어렵거나 검증이 필요한 기능을 위해 채택한 외부 라이브러리입니다.

lunar-typescript (Calendar Engine)

Usage: 양력(Solar) 날짜를 절기(Solar Terms) 기준의 만세력 데이터로 변환하고, 연/월/일의 간지(Gan-Ji)를 추출하는 핵심 엔진으로 활용.

Role: 복잡한 천문 계산(절기, 입춘 기준 연도 변경 등)의 정확성 보장.

Source: https://github.com/6tail/lunar-typescript

Tailwind CSS (Utility-first CSS)

Usage: flex, grid, absolute 등 유틸리티 클래스를 활용하여 반응형 모바일 레이아웃과 애니메이션(Transition)을 신속하게 구축.

Docs: https://tailwindcss.com

3. Internal Algorithms & Logic (Custom Implementation)
외부 라이브러리 없이 자체적으로 개발한 핵심 비즈니스 로직입니다.

Dynamic Fortune Generation System (Node.js Script)

File: generate_fortunes.js

Description: 오행의 상생상극(Interaction of 5 Elements) 원리를 알고리즘화하여, **625가지(5x5x5x5)**의 경우의 수에 따른 운세 데이터를 JSON 형태로 자동 생성 및 구축.

Timezone Normalization Logic

Logic: new Date(y, m, d, 12, 0, 0)

Description: 사용자 로컬 타임존 및 썸머타임에 의한 날짜 밀림(Date Shift) 현상을 방지하기 위해, 사주 계산 시 시간을 **정오(Noon)**로 고정하는 정규화 로직 적용.

Step-by-Step Interactive Flow

Logic: composables/useFortune.ts

Description: 사용자 입력을 단계별로 검증하고, nextTick을 활용해 자연스러운 포커스 이동과 DOM 업데이트를 제어하는 UX 로직 구현.

4. Development Environment
개발 및 배포를 위해 사용된 환경입니다.

Runtime: Node.js (v18+ LTS recommended)

Package Manager: npm (or yarn/pnpm)

IDE: Visual Studio Code (with Volar Extension)