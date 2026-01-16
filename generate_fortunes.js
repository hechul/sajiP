import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

// 오행별 상징 키워드 (문장 꾸미기용)
const keywords = {
  Wood: { nature: 'tree', action: 'grow', vibe: 'creative' },
  Fire: { nature: 'flame', action: 'burn', vibe: 'passionate' },
  Earth: { nature: 'mountain', action: 'settle', vibe: 'stable' },
  Metal: { nature: 'sword', action: 'sharpen', vibe: 'decisive' },
  Water: { nature: 'ocean', action: 'flow', vibe: 'wise' }
};

// 관계 정의 (기존 유지)
const relations = {
  0: { type: 'Same', score: 10, label: 'Companion' },
  1: { type: 'Output', score: 5, label: 'Expression' },
  2: { type: 'Wealth', score: 15, label: 'Opportunity' },
  3: { type: 'Pressure', score: -10, label: 'Discipline' },
  4: { type: 'Support', score: 20, label: 'Comfort' },
};

// 🌟 핵심: 오행 조합에 따라 문장을 다르게 만드는 함수
const getDynamicText = (context, stemRel, branchRel, myEl, targetEl) => {
  
  const myKey = keywords[myEl];
  const targetKey = keywords[targetEl];
  
  // 1. Daily (하루 운세 - 감정, 컨디션)
  if (context === 'day') {
    if (stemRel.type === 'Same') {
      return {
        desc: `Your ${myEl} energy meets another ${targetEl}. Like two ${myKey.nature}s standing together, you feel understood but might compete for space.`,
        advice: `Collaborate with peers who share your ${myKey.vibe} vibe.`
      };
    }
    if (stemRel.type === 'Output') {
      return {
        desc: `Your ${myEl} creates ${targetEl}. Just as wood burns to make fire or metal melts to become water, you are pouring your energy out.`,
        advice: `Express your ${myKey.vibe} ideas, but don't burn out.`
      };
    }
    if (stemRel.type === 'Wealth') {
      return {
        desc: `Your ${myEl} controls ${targetEl}. You have the upper hand today. It's like a ${myKey.nature} conquering the landscape.`,
        advice: "Focus on tangible results and goals."
      };
    }
    if (stemRel.type === 'Pressure') {
      return {
        desc: `The ${targetEl} energy puts pressure on your ${myEl}. It feels like a ${targetKey.nature} blocking or cutting your path.`,
        advice: "Endure the stress; it will refine you."
      };
    }
    if (stemRel.type === 'Support') {
      return {
        desc: `The ${targetEl} feeds your ${myEl}. Like rain nourishing a tree or earth producing metal, you are being recharged.`,
        advice: "Relax and accept the help coming your way."
      };
    }
  }

  // 2. Monthly (이달의 운세 - 사회, 직장)
  if (context === 'month') {
    if (stemRel.type === 'Pressure') {
      return {
        desc: `This month, the social environment (${targetEl}) restricts your freedom. Rules are strict like strict metal or a heavy mountain.`,
        advice: "Keep a low profile at work."
      };
    }
    if (stemRel.type === 'Wealth') {
      return {
        desc: `A productive month where your ${myEl} skills can manage the ${targetEl} resources effectively. Career growth is visible.`,
        advice: "Push for promotion or profit."
      };
    }
    if (stemRel.type === 'Support') {
      return {
        desc: `The environment favors you. Mentors representing ${targetEl} energy will support your ${myKey.vibe} growth.`,
        advice: "Seek guidance or sign contracts."
      };
    }
    // 기본
    return {
      desc: `A month of ${stemRel.label}. Your ${myEl} energy interacts with the month's ${targetEl} in a balanced way.`,
      advice: "Focus on maintaining stability."
    };
  }

  // 3. Yearly (올해의 운세 - 큰 흐름)
  if (context === 'year') {
    if (stemRel.type === 'Same') {
      return {
        desc: `A year of 'The ${targetKey.nature}'. You will find many people like you. It's a year of networking and competition.`,
        advice: "Build your team."
      };
    }
    if (stemRel.type === 'Wealth') {
      return {
        desc: `A year of harvest. Your efforts to control ${targetEl} will pay off. Think of it as conquering new territory.`,
        advice: "Be ambitious with your long-term goals."
      };
    }
     // 기본
     return {
      desc: `The year brings ${targetEl} energy to your ${myEl}. It defines the background of your life as '${stemRel.label}'.`,
      advice: "Plan according to the flow."
    };
  }
};

const dataDay = {};
const dataMonth = {};
const dataYear = {};

// 루프
elements.forEach(myStem => {
  elements.forEach(myBranch => {
    elements.forEach(targetStem => {
      elements.forEach(targetBranch => {
        
        const key = `${myStem}_${myBranch}_vs_${targetStem}_${targetBranch}`;
        
        const myStemIdx = elements.indexOf(myStem);
        const myBranchIdx = elements.indexOf(myBranch);
        const targetStemIdx = elements.indexOf(targetStem);
        const targetBranchIdx = elements.indexOf(targetBranch);

        const stemRel = relations[(targetStemIdx - myStemIdx + 5) % 5];
        const branchRel = relations[(targetBranchIdx - myBranchIdx + 5) % 5];

        let totalScore = 50 + stemRel.score + branchRel.score;
        // 점수 약간의 랜덤성 추가 (너무 기계적이지 않게)
        totalScore += Math.floor(Math.random() * 5) - 2; 
        if (totalScore > 98) totalScore = 98;
        if (totalScore < 40) totalScore = 40;

        // 텍스트 생성
        const textDay = getDynamicText('day', stemRel, branchRel, myStem, targetStem);
        const textMonth = getDynamicText('month', stemRel, branchRel, myStem, targetStem);
        const textYear = getDynamicText('year', stemRel, branchRel, myStem, targetStem);

        // 제목도 오행 섞어서 다양하게
        const makeTitle = (t1, t2) => `${t1} Meets ${t2}`;

        dataDay[key] = { 
          title: makeTitle(myStem, targetStem), 
          score: totalScore, 
          ...textDay 
        };
        dataMonth[key] = { 
          title: `${targetStem} Month`, 
          score: totalScore, 
          ...textMonth 
        };
        dataYear[key] = { 
          title: `${targetStem} Year`, 
          score: totalScore, 
          ...textYear 
        };

      });
    });
  });
});

const dir = path.join(__dirname, 'assets/data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, 'fortunes_day.json'), JSON.stringify(dataDay, null, 2));
fs.writeFileSync(path.join(dir, 'fortunes_month.json'), JSON.stringify(dataMonth, null, 2));
fs.writeFileSync(path.join(dir, 'fortunes_year.json'), JSON.stringify(dataYear, null, 2));

console.log(`✅ Generated dynamic fortunes with unique elemental descriptions!`);