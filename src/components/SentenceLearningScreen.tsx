import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, Volume2, Mic, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SentenceLearningScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: (defaultScreen: string) => void;
  chapter?: any;
  onComplete?: (learningRecord: any) => void;
}

// 챕터별 문장 데이터
const chapterSentences: Record<string, any[]> = {
  // 공통 문장 - 초급
  'c1': [ // 기본 인사·상태
    { korean: "안녕하세요.", english: "Hello.", synonyms: ["반갑습니다.", "좋은 아침이에요."], tts_url: "/tts/sentence_1.mp3" },
    { korean: "오늘도 안녕하세요.", english: "Hello today as well.", synonyms: ["오늘 좋은 하루예요.", "오늘도 좋은 날이에요."], tts_url: "/tts/sentence_2.mp3" },
    { korean: "처음 뵙겠습니다.", english: "Nice to meet you.", synonyms: ["처음 인사드립니다.", "만나서 반갑습니다."] },
    { korean: "오늘 처음 뵙네요.", english: "First time meeting today.", synonyms: ["��늘이 처음이네요.", "처��� 봐���."] },
    { korean: "괜찮으세요?", english: "Are you okay?", synonyms: ["불편 없으세요?", "괜찮으신가요?"] },
    { korean: "어디 불편하세요?", english: "Where is it uncomfortable?", synonyms: ["불편한 곳 있으세요?", "어디 아프세요?"] },
    { korean: "잘 지내세요?", english: "How are you?", synonyms: ["요즘 어떠세요?", "어떻게 지내세요?"] },
    { korean: "네, 잘 지냅니다.", english: "Yes, I'm doing well.", synonyms: ["잘 있어요.", "좋습니다."] },
    { korean: "안녕히 계세요.", english: "Goodbye (to someone staying).", synonyms: ["다음에 뵙겠습니다.", "또 만나요."] },
    { korean: "안녕히 가세요.", english: "Goodbye (to someone leaving).", synonyms: ["조심히 가세요.", "잘 가세요."] },
  ],
  'c2': [ // 요청·부탁
    { korean: "도와주세요.", english: "Please help me.", synonyms: ["부탁드립니다.", "도움 부탁해요."] },
    { korean: "잠깐만 도와주세요.", english: "Please help me for a moment.", synonyms: ["조금만 도와주세요.", "잠시 도움이 필요해요."] },
    { korean: "천천히 말해 주세요.", english: "Please speak slowly.", synonyms: ["조금만 천천히요.", "느리게 말씀해 주세요."] },
    { korean: "한 번만 더 천천히요.", english: "One more time slowly please.", synonyms: ["다시 천천히 해주세요.", "천천히 한 번 더요."] },
    { korean: "다시 말씀해 주세요.", english: "Please say it again.", synonyms: ["한 번만 더 부탁해요.", "다시 한 번 말씀해 주세요."] },
    { korean: "중요한 부분만 다시요.", english: "Just the important part again.", synonyms: ["핵심만 다시요.", "중요한 것만 다시요."] },
    { korean: "알려주세요.", english: "Please let me know.", synonyms: ["말씀해 주세요.", "설명해 주세요."] },
    { korean: "기다려 주세요.", english: "Please wait.", synonyms: ["잠시만요.", "조금만 기다려요."] },
    { korean: "확인해 주세요.", english: "Please check.", synonyms: ["봐주세요.", "체크해 주세요."] },
    { korean: "부탁합니다.", english: "I ask you.", synonyms: ["부탁드려요.", "도와주시면 감사하겠어요."] },
  ],
  'c3': [ // 확인·동의
    { korean: "맞나요?", english: "Is it correct?", synonyms: ["맞으세요?", "이렇게 맞죠?"] },
    { korean: "이 부분이 맞나요?", english: "Is this part correct?", synonyms: ["여기가 맞아요?", "이게 맞는 건가요?"] },
    { korean: "이해하셨어요?", english: "Do you understand?", synonyms: ["���해되셨나요?", "알겠어요?"] },
    { korean: "여기까지 이해되셨죠?", english: "You understood up to here, right?", synonyms: ["여기까지 괜찮으세요?", "이해되시죠?"] },
    { korean: "괜찮으세요?", english: "Is it okay?", synonyms: ["괜찮으시죠?", "문제없으세요?"] },
    { korean: "동의하시나요?", english: "Do you agree?", synonyms: ["괜찮으신가요?", "이대로 하실래요?"] },
    { korean: "확인했습니다.", english: "I confirmed.", synonyms: ["체크했어요.", "확인 완료했습니다."] },
    { korean: "알겠습니다.", english: "I understand.", synonyms: ["이해했어요.", "네, 알았어요."] },
  ],

  // 공통 문장 - 중급
  'c4': [ // 전화 응대하기
    { korean: "네, 어떻게 도와드릴까요?", english: "Yes, how can I help you?", synonyms: ["무엇을 도와드릴까요?", "���씀하세요."] },
    { korean: "예약하시겠습니까?", english: "Would you like to make a reservation?", synonyms: ["예약 도와드릴까요?", "예약하실 건가요?"] },
    { korean: "성함이 어떻게 되십니까?", english: "What is your name?", synonyms: ["성함을 알려 주세요.", "이름이 어떻게 되세요?"] },
    { korean: "몇 분이십니까?", english: "How many people?", synonyms: ["몇 명이세요?", "인원이 몇 명이세요?"] },
  ],
  // 공통 문장 - 중급
  'c5': [ // 안내·설명
    { korean: "이렇게 진행하겠습니다.", english: "I'll proceed this way.", synonyms: ["이런 순서로 하겠습니다.", "이렇게 할게요."] },
    { korean: "먼저 이것부터 하겠습니다.", english: "I'll do this first.", synonyms: ["이것부터 시작할게요.", "우선 이걸 하겠습니다."] },
    { korean: "잠시만 기다려 주세요.", english: "Please wait a moment.", synonyms: ["금방 도와드릴게요.", "조금만 기다려 주세요."] },
    { korean: "5분만 기다려 주세요.", english: "Please wait 5 minutes.", synonyms: ["5분 정도 걸려요.", "오 분만 기다리세요."] },
    { korean: "지금 확인 중입니다.", english: "I'm checking now.", synonyms: ["확인해 보겠습니다.", "지금 보고 있어요."] },
    { korean: "시스템 확인 중입니다.", english: "Checking the system.", synonyms: ["시스템 보고 있어요.", "시스템 체크 중이에요."] },
    { korean: "곧 도와드리겠습니다.", english: "I'll help you soon.", synonyms: ["금방 도와드릴게요.", "곧 지원하겠습니다."] },
    { korean: "순서대로 안내하겠습니다.", english: "I'll guide you in order.", synonyms: ["차례로 설명할게요.", "순서대�� 할게요."] },
    { korean: "다음 단계로 넘어가겠습니다.", english: "Moving to the next step.", synonyms: ["다음으로 갈게요.", "다음 단계입니다."] },
    { korean: "여기까지 진행했습니다.", english: "We've progressed to here.", synonyms: ["여기까지 했어요.", "이만큼 완료했습니다."] },
    { korean: "작업 완료했습니다.", english: "Work completed.", synonyms: ["다 끝났어요.", "완료됐습니다."] },
    { korean: "이제 사용하실 수 있어요.", english: "You can use it now.", synonyms: ["지금 쓰실 수 있어요.", "사용 가능합니다."] },
  ],
  'c6': [ // 제안·권유
    { korean: "이 방법은 어떠세요?", english: "How about this way?", synonyms: ["이렇게 해 보실래요?", "이 방법 어때요?"] },
    { korean: "더 쉬운 방법도 있어요.", english: "There's an easier way too.", synonyms: ["다른 방법도 있어요.", "더 간단한 게 있어요."] },
    { korean: "필요하시면 도와���릴게요.", english: "I'll help if you need.", synonyms: ["요청하시면 지원하겠습니다.", "도움 필요하면 말씀하세요."] },
    { korean: "원하시면 지금 도와드릴게요.", english: "I can help now if you want.", synonyms: ["지금 도와드릴까요?", "원하시면 바로 할게요."] },
    { korean: "이것도 고려해 보세��.", english: "Consider this too.", synonyms: ["이것도 생각해 보세요.", "이 부분도 봐주세요."] },
    { korean: "다른 옵션도 있어요.", english: "There are other options.", synonyms: ["선택지가 더 있어요.", "다른 방법도 있어요."] },
    { korean: "추천드려요.", english: "I recommend it.", synonyms: ["권해드립니다.", "좋을 것 같아요."] },
    { korean: "한번 해보세요.", english: "Try it once.", synonyms: ["시도해 보세요.", "해보시는 게 좋아요."] },
    { korean: "변경하시겠어요?", english: "Would you like to change?", synonyms: ["바꾸실래요?", "수정하시겠어요?"] },
    { korean: "이대로 괜찮으세요?", english: "Is this okay as is?", synonyms: ["이렇게 해도 돼요?", "이대로 진행할까요?"] },
  ],
  'c7': [ // 문제상황 대응
    { korean: "문제가 발생했습니다.", english: "A problem occurred.", synonyms: ["오류가 생겼습니다.", "문제가 생겼어요."] },
    { korean: "일시�� 문제입니다.", english: "It's a temporary problem.", synonyms: ["일시적 오류예요.", "잠깐 문제가 있어요."] },
    { korean: "다시 시도해 보시겠어요?", english: "Would you try again?", synonyms: ["한 번 더 해 보실래요?", "재시도하시겠��요?"] },
    { korean: "방법을 바꿔 시도해요.", english: "Try changing the method.", synonyms: ["다른 방법으로 해봐요.", "방식을 바꿔볼게요."] },
    { korean: "도움이 더 필요합니다.", english: "Need more help.", synonyms: ["지원이 필요합니다.", "추가 도움 필요해요."] },
    { korean: "담당자 도움을 요청��니다.", english: "Requesting help from person in charge.", synonyms: ["담당자에게 문의할게요.", "책임자 도움 요청해요."] },
    { korean: "확인이 필요합니다.", english: "Need to check.", synonyms: ["체크해야 해요.", "검토가 필요해요."] },
    { korean: "조금 시간이 걸려요.", english: "It takes some time.", synonyms: ["시간이 좀 필요해요.", "시간 좀 걸려요."] },
    { korean: "최대한 빨리 해결하겠습니다.", english: "I'll solve it as quickly as possible.", synonyms: ["빨리 처리할게요.", "서둘러 해결할게요."] },
    { korean: "현재 해결 중입니다.", english: "Currently resolving.", synonyms: ["지금 처리 중이에요.", "해결하고 있어요."] },
    { korean: "완료되면 알려드릴게요.", english: "I'll let you know when done.", synonyms: ["끝나면 연락드려요.", "완료 시 알려드려요."] },
    { korean: "양해 부탁드립니다.", english: "Please understand.", synonyms: ["이해 부탁해요.", "양해해 주세요."] },
  ],
  'c8': [ // 일정·합의
    { korean: "시간을 맞춰 보겠습니다.", english: "I'll match the time.", synonyms: ["일정을 조정하겠습니다.", "시간 맞춰볼게요."] },
    { korean: "내일 오전으로 괜찮으세요?", english: "Is tomorrow morning okay?", synonyms: ["내일 아침 괜찮아요?", "내일 오전 가능하세요?"] },
    { korean: "이 조건으로 진행할게요.", english: "I'll proceed with these conditions.", synonyms: ["이대로 진행하겠습니다.", "이 조건으로 할게요."] },
    { korean: "조건 일부만 변경할게요.", english: "I'll change only some conditions.", synonyms: ["일부 수정할게요.", "몇 가지만 바꿀게요."] },
    { korean: "합의하셨나요?", english: "Did you agree?", synonyms: ["동의하세요?", "괜찮으신가요?"] },
    { korean: "확정하시겠어요?", english: "Will you confirm?", synonyms: ["최종 결정하실래��?", "확정할까요?"] },
    { korean: "변경 ��능합니다.", english: "Changes are possible.", synonyms: ["수정할 수 있어요.", "바꿀 수 있어요."] },
    { korean: "일정 조율하겠습니다.", english: "I'll coordinate the schedule.", synonyms: ["스케줄 맞춰볼게요.", "일정 맞춰드릴게���."] },
    { korean: "다음 주로 미룰까요?", english: "Shall we postpone to next week?", synonyms: ["다음 주로 연기할래요?", "다음 주로 할까요?"] },
    { korean: "결정 내리셨어요?", english: "Have you decided?", synonyms: ["결정하셨나요?", "정하셨어요?"] },
  ],

  // 주방보조 - 초급
  'j1-kitchen-assistant': [ // 조리 도구 이름
    { korean: "칼을 주세요.", english: "Please give me the knife.", synonyms: ["칼 좀 주세요.", "칼이 필요해요."] },
    { korean: "도마는 어디 있어요?", english: "Where is the cutting board?", synonyms: ["도마 어디 있죠?", "도마 위치 알려주세요."] },
    { korean: "냄비가 뜨거워요.", english: "The pot is hot.", synonyms: ["냄비 뜨겁습니다.", "냄비 조심하세요."] },
    { korean: "프라이팬이 필요합니다.", english: "I need a frying pan.", synonyms: ["프라이팬 주세요.", "팬이 필요해요."] },
    { korean: "국자 어디 있어요?", english: "Where is the ladle?", synonyms: ["국자 좀 찾아주세요.", "국자 위치가 어디죠?"] },
    { korean: "집게가 필요해요.", english: "I need tongs.", synonyms: ["집게 좀 주세요.", "집게 어디 있나요?"] },
    { korean: "믹서기 켜주세요.", english: "Please turn on the blender.", synonyms: ["믹서 좀 켜주세요.", "블렌더 작동시켜 주세요."] },
    { korean: "채칼로 썰어요.", english: "Slice it with a mandolin.", synonyms: ["채칼 사용하세요.", "채를 썰어요."] },
    { korean: "볼이 필요합니다.", english: "I need a bowl.", synonyms: ["그릇 좀 주세요.", "볼 하나 주세요."] },
    { korean: "거품기 주��요.", english: "Please give me a whisk.", synonyms: ["거품기 어디 있어요?", "휘핑기 주세요."] },
  ],
  'j2-kitchen-assistant': [ // 식재료 이름
    { korean: "양파를 썰어 주세요.", english: "Please chop the onions.", synonyms: ["양파 써세요.", "양파 자르세요."] },
    { korean: "고기가 신선해요.", english: "The meat is fresh.", synonyms: ["고기 상태가 좋아요.", "고기가 좋네요."] },
    { korean: "소금을 조금만 넣으세요.", english: "Put in just a little salt.", synonyms: ["소금 적게 넣으세요.", "간 조금만 하세요."] },
    { korean: "야채를 씻었습니다.", english: "I washed the vegetables.", synonyms: ["야채 다 씻���어요.", "채소 깨끗이 했어요."] },
    { korean: "마늘 다져주세요.", english: "Please mince the garlic.", synonyms: ["마늘 잘게 썰어요.", "마늘 다지세요."] },
    { korean: "당근이 필요해요.", english: "I need carrots.", synonyms: ["당근 어디 있어요?", "당근 좀 주세요."] },
    { korean: "고추가루 넣을까요?", english: "Should I add red pepper powder?", synonyms: ["고추가루 추가할까요?", "고춧가루 넣어요?"] },
    { korean: "기름 조금만요.", english: "Just a little oil.", synonyms: ["기름 적게요.", "오일 살짝만요."] },
    { korean: "파를 썰었어요.", english: "I chopped the green onions.", synonyms: ["파 다 썰었어요.", "대파 손질했어요."] },
    { korean: "버섯이 상했어요.", english: "The mushrooms are spoiled.", synonyms: ["버섯 안 좋아요.", "버섯 못 쓰겠어요."] },
    { korean: "달걀 깨주세요.", english: "Please crack the eggs.", synonyms: ["계란 깨세요.", "달걀 깨뜨려요."] },
    { korean: "생강 편으로 썰어요.", english: "Slice the ginger thinly.", synonyms: ["생강 얇게 썰어요.", "생강 편 내세요."] },
  ],
  'j3-kitchen-assistant': [ // 기본 조리 동작
    { korean: "물을 끓여 ��세요.", english: "Please boil the water.", synonyms: ["��� 끓��세요.", "물 좀 데워주세요."] },
    { korean: "기름에 볶으세요.", english: "Stir-fry it in oil.", synonyms: ["볶아 주세요.", "기름에 익히세요."] },
    { korean: "약한 불로 줄이세요.", english: "Turn down to low heat.", synonyms: ["불 낮추세요.", "약불로 하세요."] },
    { korean: "센 불로 올려요.", english: "Turn up to high heat.", synonyms: ["불 높이세요.", "강불로 하세요."] },
    { korean: "뚜껑을 덮으세요.", english: "Cover with the lid.", synonyms: ["덮개 덮으세요.", "뚜껑 닫으세요."] },
    { korean: "저어주세요.", english: "Please stir.", synonyms: ["섞어주세요.", "휘젓세요."] },
    { korean: "물을 빼세요.", english: "Drain the water.", synonyms: ["물기 제거하세요.", "체에 받치세요."] },
    { korean: "재료를 섞어요.", english: "Mix the ingredients.", synonyms: ["재료 합쳐요.", "같이 섞으세요."] },
    { korean: "���겨주세요.", english: "Please deep-fry.", synonyms: ["기름에 튀기세요.", "튀김하세요."] },
    { korean: "찜통에 쪄요.", english: "Steam it in the steamer.", synonyms: ["찜기에 넣어요.", "쪄내세요."] },
  ],
  
  // 주방보조 - 중급
  'j4-kitchen-assistant': [ // 주문 확인하기
    { korean: "주문 확인합���다.", english: "I'm checking the order.", synonyms: ["주문 체크해요.", "오더 확인이요."] },
    { korean: "테이블 5번 맞죠?", english: "Table 5, correct?", synonyms: ["5번 테이블이죠?", "테이블 번호 5번?"] },
    { korean: "김치찌개 하��요.", english: "One kimchi stew.", synonyms: ["김치찌개 1개요.", "김치찌개 한 그릇이요."] },
    { korean: "공기밥 추가요.", english: "Add a bowl of rice.", synonyms: ["밥 추가요.", "공기밥 하나 더요."] },
    { korean: "매운맛 추가요.", english: "Make it spicier.", synonyms: ["더 맵게요.", "맵게 해주세요."] },
    { korean: "덜 맵게 해요.", english: "Less spicy please.", synonyms: ["조금만 맵게요.", "안 맵게 해주세요."] },
    { korean: "파 빼달래요.", english: "No green onions.", synonyms: ["파 제외요.", "파 안 넣어요."] },
    { korean: "땅콩 알레르기요.", english: "Peanut allergy.", synonyms: ["땅콩 못 먹어요.", "땅콩 빼주세요."] },
    { korean: "포장 주문이에요.", english: "It's to-go.", synonyms: ["테이크아웃이요.", "포장 주문이요."] },
    { korean: "주문 이상 없어요.", english: "No changes to order.", synonyms: ["주문 그대로요.", "수정 사항 없어요."] },
    { korean: "급한 주문이에요.", english: "It's an urgent order.", synonyms: ["빨리 해야 해요.", "급해요."] },
    { korean: "같이 내주세요.", english: "Serve together.", synonyms: ["동시에 내요.", "함께 내주세요."] },
    { korean: "따��� 내주세요.", english: "Serve separately.", synonyms: ["각각 내요.", "분리해서 내요."] },
    { korean: "아동용으로요.", english: "For a child.", synonyms: ["어린이용이요.", "키즈 메뉴요."] },
    { korean: "재주문이에요.", english: "It's a reorder.", synonyms: ["추가 주문이요.", "또 시켰어요."] },
  ],
  'j5-kitchen-assistant': [ // 조리 지시 받기
    { korean: "네, 먼저 야채요.", english: "Yes, veggies first.", synonyms: ["야채 먼저 할게요.", "채소부터 하겠습니다."] },
    { korean: "지금 중불로요.", english: "Set to medium heat.", synonyms: ["중불로 할게요.", "중간 불로 하겠습니다."] },
    { korean: "소금 한 꼬집요.", english: "A pinch of salt.", synonyms: ["소금 조금만요.", "간 살짝만요."] },
    { korean: "3분 더 끓여요.", english: "Boil 3 more minutes.", synonyms: ["3분 더 익혀요.", "삼 분 더 하세요."] },
    { korean: "면은 알덴테요.", english: "Noodles al dente.", synonyms: ["면 살짝만 익혀요.", "면 덜 익혀요."] },
    { korean: "소스 반만 넣어요.", english: "Add half the sauce.", synonyms: ["소스 절반만요.", "소스 조금만 넣어요."] },
    { korean: "접시는 데워요.", english: "Warm the plates.", synonyms: ["접시 예열해요.", "그�� 따뜻하게 해요."] },
    { korean: "마��막��� 파요.", english: "Add scallions last.", synonyms: ["끝에 파 넣어요.", "파는 나중에요."] },
    { korean: "이렇게 맞나요?", english: "Is this correct?", synonyms: ["이게 맞아요?", "제대로 했나요?"] },
    { korean: "더 익힐까요?", english: "Cook it longer?", synonyms: ["더 할까요?", "더 익혀요?"] },
    { korean: "물 더 넣을까요?", english: "Should I add more water?", synonyms: ["물 추가할까요?", "물 더 부을까요?"] },
    { korean: "이제 내도 돼요?", english: "Can I serve it now?", synonyms: ["내도 될까요?", "서빙해도 돼요?"] },
  ],
  'j6-kitchen-assistant': [ // 위생 관리 표현
    { korean: "손을 씻었어요.", english: "I washed my hands.", synonyms: ["손 다 씻었어요.", "손 세척했어요."] },
    { korean: "소독했습니다.", english: "I sanitized it.", synonyms: ["살균했어요.", "소독 완료했어요."] },
    { korean: "장갑 갈아요.", english: "Changing gloves.", synonyms: ["장갑 바꿔요.", "새 장갑 껴요."] },
    { korean: "청소 시작해요.", english: "Starting to clean.", synonyms: ["청소할게요.", "정리 시작해요."] },
    { korean: "도마를 교체해요.", english: "Replacing the cutting board.", synonyms: ["��마 바꿔요.", "새 도마 쓸게요."] },
    { korean: "쓰레기 버렸어요.", english: "I threw out the trash.", synonyms: ["쓰레기 비웠어요.", "쓰레기통 비웠어요."] },
    { korean: "바닥 닦을게요.", english: "I'll mop the floor.", synonyms: ["바닥 청소해요.", "마룻바닥 닦아요."] },
    { korean: "유통기한 확인했어요.", english: "I checked the expiration date.", synonyms: ["날짜 체크했어요.", "기한 봤어요."] },
    { korean: "냉장고 정리해요.", english: "Organizing the fridge.", synonyms: ["냉장고 정돈해요.", "냉장고 치워요."] },
    { korean: "환기시켜요.", english: "Ventilating.", synonyms: ["환기할게요.", "공기 순환시켜요."] },
  ],

  // 서빙 - 초급
  'j1-server': [ // 메뉴 이름 익히기
    { korean: "비빔밥 하나 나왔습니다.", english: "One bibimbap is ready.", synonyms: ["비빔밥 나왔어요.", "비빔밥 완성됐어요."] },
    { korean: "커피는 따뜻한 거로 드릴까요?", english: "Would you like hot coffee?", synonyms: ["따뜻한 커피 드릴까요?", "핫으로 드릴까요?"] },
    { korean: "이것은 불고기입니다.", english: "This is bulgogi.", synonyms: ["불고기예요.", "불고기 메뉴입니다."] },
    { korean: "김치찌��� 주문하셨어요?", english: "Did you order kimchi stew?", synonyms: ["김치찌개 맞으세요?", "김치찌개 시키셨나요?"] },
    { korean: "된장찌개 나갑니다.", english: "Soybean paste stew is coming.", synonyms: ["된장찌개 나와���.", "된장찌개 갑니다."] },
    { korean: "삼겹살 2인분이요.", english: "Pork belly for two.", synonyms: ["삼겹살 2인분요.", "삼겹살 두 인분이요."] },
    { korean: "냉면 따뜻한 육수로요.", english: "Cold noodles with warm broth.", synonyms: ["냉면 온육수로요.", "냉면 뜨거운 국물로요."] },
    { korean: "사이드 메뉴 추천해요.", english: "I recommend a side dish.", synonyms: ["반찬 추천드려요.", "사이드 권해요."] },
    { korean: "음료 먼저 나와요.", english: "Drinks come first.", synonyms: ["음료 먼저 드릴게요.", "음료가 먼저예요."] },
    { korean: "디저트 있으세요?", english: "Do you have dessert?", synonyms: ["후식 있나요?", "디저트 있어요?"] },
    { korean: "세트 메뉴예요.", english: "It's a set menu.", synonyms: ["세트로 나와요.", "세트 구성이에요."] },
    { korean: "오늘의 추천이에요.", english: "It's today's special.", synonyms: ["오늘 특선이에요.", "오늘 추천 메뉴예요."] },
  ],
  'j2-server': [ // 자리 안내하기
    { korean: "몇 명이세요?", english: "How many people?", synonyms: ["몇 분���세요?", "인원이 어떻게 되세요?"] },
    { korean: "이쪽으로 앉으세요.", english: "Please sit this way.", synonyms: ["여기 앉으세요.", "이 자리로 오세요."] },
    { korean: "창가 자리 괜찮으세요?", english: "Is a window seat okay?", synonyms: ["창문 쪽 자리 괜찮아요?", "창가 앉으실래요?"] },
    { korean: "안쪽 자리 있어요.", english: "There's a seat inside.", synonyms: ["안쪽에 앉으세요.", "안에 자리 있어요."] },
    { korean: "예약하셨어요?", english: "Do you have a reservation?", synonyms: ["예약 있으세요?", "예약 손님이세요?"] },
    { korean: "조금만 기다려 주���요.", english: "Please wait a moment.", synonyms: ["잠시만 기다리세요.", "곧 자리 나와요."] },
    { korean: "금방 정리할게요.", english: "I'll clean it right away.", synonyms: ["바로 치울게요.", "곧 정리해요."] },
    { korean: "룸 자리 있어요.", english: "We have a private room.", synonyms: ["룸 가능해요.", "독립 공간 있어요."] },
    { korean: "테라스 좋아요.", english: "The terrace is nice.", synonyms: ["야외 자리 어때요?", "테라스 앉으세요."] },
    { korean: "바 좌석 괜찮아요?", english: "Is a bar seat okay?", synonyms: ["바 자리 되세요?", "바에 앉으실래요?"] },
  ],
  'j3-server': [ // 물건 전달하기
    { korean: "물 가져다 드릴게요.", english: "I'll bring you water.", synonyms: ["물 드릴게요.", "물 갖다 드리겠습니다."] },
    { korean: "수저 여기 있습니다.", english: "Here are the utensils.", synonyms: ["수저요.", "수저 드립니다."] },
    { korean: "냅킨 더 필요하세요?", english: "Do you need more napkins?", synonyms: ["냅킨 더 드릴까요?", "냅킨 추가로 드릴까요?"] },
    { korean: "물티슈 드릴게요.", english: "I'll give you wet wipes.", synonyms: ["물티슈요.", "물티슈 가져올게요."] },
    { korean: "앞치마 필요하세요?", english: "Do you need an apron?", synonyms: ["앞치마 드릴까요?", "가운 필요하세요?"] },
    { korean: "얼음물 더 드릴까요?", english: "More ice water?", synonyms: ["물 리필할까요?", "물 더 드릴까요?"] },
    { korean: "반찬 더 가져올게요.", english: "I'll bring more side dishes.", synonyms: ["반찬 리필해요.", "반찬 더 드릴게요."] },
    { korean: "소스 여기 있어요.", english: "Here's the sauce.", synonyms: ["소스 드려요.", "양념 있어요."] },
  ],
  
  // 서빙 - 중급
  'j4-server': [ // 주문 받기
    { korean: "주문하시겠어요?", english: "Would you like to order?", synonyms: ["주문하실래요?", "메뉴 정하셨어요?"] },
    { korean: "추천 메뉴는 불고기예요.", english: "I recommend the bulgogi.", synonyms: ["불고기 추천해요.", "불고기가 맛있어요."] },
    { korean: "이 메뉴 인기 많아요.", english: "This menu is popular.", synonyms: ["이거 많이 시켜요.", "베스트 메뉴예요."] },
    { korean: "맵기 조절 가능해요.", english: "You can adjust the spiciness.", synonyms: ["맵기 조절돼요.", "맵기 선택하세요."] },
    { korean: "고기 익히기는요?", english: "How would you like it cooked?", synonyms: ["굽기 정도는요?", "웰던으로 할까요?"] },
    { korean: "사이드 메뉴 추가하세요.", english: "Add a side menu.", synonyms: ["사이드 같이 시키세요.", "사이드 어때요?"] },
    { korean: "세트로 하면 싸요.", english: "The set is cheaper.", synonyms: ["세트가 저렴해요.", "세트 ��천해요."] },
    { korean: "음료 뭐로 하세요?", english: "What would you like to drink?", synonyms: ["음료 주문하세요?", "마실 거 뭐 드릴까요?"] },
    { korean: "지금 품절이에요.", english: "It's sold out now.", synonyms: ["재고 없어요.", "오늘 다 나갔어요."] },
    { korean: "조금 시간 걸려요.", english: "It takes some time.", synonyms: ["시간 좀 걸려요.", "20분 정도예요."] },
    { korean: "같이 나갈까요?", english: "Should they come together?", synonyms: ["동시에 내줄까요?", "함께 드릴까요?"] },
    { korean: "따로 내줄까요?", english: "Should I bring them separately?", synonyms: ["각각 내줄까요?", "나눠서 드릴까요?"] },
    { korean: "주문 확인할게���.", english: "Let me confirm your order.", synonyms: ["주문 체크할게요.", "주문 맞는지 볼게요."] },
    { korean: "주문 들어갔어요.", english: "Your order is in.", synonyms: ["주문 넣었어요.", "주방에 전달했어요."] },
    { korean: "잠깐만 기다리세요.", english: "Please wait a moment.", synonyms: ["조금만요.", "잠시만요."] },
  ],
  'j5-server': [ // 메뉴 추천하기
    { korean: "이 메뉴 강추예요.", english: "I highly recommend this.", synonyms: ["이거 정말 맛있어요.", "꼭 드셔보세요."] },
    { korean: "오늘 특선이에요.", english: "It's today's special.", synonyms: ["오늘의 메뉴예요.", "오늘만 있어요."] },
    { korean: "시즌 메뉴예요.", english: "It's a seasonal menu.", synonyms: ["계절 메뉴예요.", "한정 메뉴예요."] },
    { korean: "첫손님 서���스예요.", english: "First customer service.", synonyms: ["첫손님 혜택이에요.", "오늘 첫손님이라 드려요."] },
    { korean: "2인 세트 어때요?", english: "How about a set for two?", synonyms: ["커플 세트는요?", "2인용 ��천해요."] },
    { korean: "안 맵게 해드릴게요.", english: "I'll make it not spicy.", synonyms: ["덜 맵게 할게요.", "순하게 할게요."] },
    { korean: "어린이도 먹을 수 있어요.", english: "Children can eat it too.", synonyms: ["아이들도 괜찮아요.", "아동용도 돼요."] },
    { korean: "베지테리언 메뉴 있어요.", english: "We have vegetarian options.", synonyms: ["채식 메뉴 있어요.", "고기 없는 거 있어요."] },
    { korean: "사���으로 보여드릴까요?", english: "Should I show you a picture?", synonyms: ["사진 있어요.", "이미지 보여줄까요?"] },
    { korean: "양 많아요.", english: "It's a large portion.", synonyms: ["양이 커요.", "많이 나와요."] },
  ],
  'j6-server': [ // 계산 안내하기
    { korean: "계산하시겠어요?", english: "Would you like to pay?", synonyms: ["결제하실래요?", "계산해 드릴까요?"] },
    { korean: "카드 되세요?", english: "Do you take cards?", synonyms: ["카드 가능해요?", "카드 결제 돼요?"] },
    { korean: "영수증 필요하세요?", english: "Do you need a receipt?", synonyms: ["영수증 드릴까요?", "현금영���증 하세요?"] },
    { korean: "합계 3만원이에요.", english: "The total is 30,000 won.", synonyms: ["총 3만원입니다.", "전부 30,000원이에요."] },
    { korean: "할인 적용됐어요.", english: "The discount is applied.", synonyms: ["할인했어요.", "깎였어요."] },
    { korean: "포인트 적립할까요?", english: "Should I add points?", synonyms: ["포인트 쌓을래요?", "멤버십 있으세요?"] },
    { korean: "쿠폰 있으세요?", english: "Do you have a coupon?", synonyms: ["할인권 있어요?", "쿠폰 사용하세요?"] },
    { korean: "일회용 영수증이에요.", english: "It's a one-time receipt.", synonyms: ["종이 영수증이에요.", "출력본이에요."] },
    { korean: "카운터에서 해주세요.", english: "Please pay at the counter.", synonyms: ["저쪽에서 하세요.", "카운터로 가세요."] },
    { korean: "테이블에서 결제돼요.", english: "You can pay at the table.", synonyms: ["여기서 돼요.", "자리에서 가능해요."] },
  ],

  // 바리스타 - 초급
  'j1-barista': [ // 음료 이름 익히기
    { korean: "아메리카노 주문하셨어요?", english: "Did you order an Americano?", synonyms: ["아메리카노 맞으세요?", "아메리카노 시키셨나요?"] },
    { korean: "카페라떼 나왔습니다.", english: "Cafe latte is ready.", synonyms: ["라떼 완성됐어요.", "라떼 나왔어요."] },
    { korean: "녹차는 따뜻하게 드릴까���?", english: "Would you like the green tea hot?", synonyms: ["녹차 핫으로 드릴까요?", "녹차 따뜻한 걸로 할까요?"] },
    { korean: "카푸치노 만들어요.", english: "Making a cappuccino.", synonyms: ["카푸치노 제조 중이에요.", "카푸치노 나가요."] },
    { korean: "에스프레소 샷이에요.", english: "It's an espresso shot.", synonyms: ["에스프레소요.", "샷만 드릴게요."] },
    { korean: "바닐라라떼 있어요.", english: "We have vanilla latte.", synonyms: ["바닐라라떼 가능해요.", "바라 주문돼요."] },
    { korean: "아이스티 드릴까요?", english: "Would you like iced tea?", synonyms: ["아이스티 할래요?", "차 차갑게요?"] },
    { korean: "핫초코 맛있어요.", english: "Hot chocolate is good.", synonyms: ["핫초코 추천해요.", "핫초코 인기 많아요."] },
    { korean: "프라푸치노 주세요.", english: "Frappuccino please.", synonyms: ["프라페 주세요.", "블렌디드 주세요."] },
    { korean: "콜드브루 있어요.", english: "We have cold brew.", synonyms: ["더치커피 있어요.", "콜드브루 돼요."] },
    { korean: "디카페인 돼요.", english: "Decaf is available.", synonyms: ["카페인 빼요.", "디카페인 가능해요."] },
    { korean: "스무디 드세요.", english: "Have a smoothie.", synonyms: ["스무디 어때요?", "스무디 추천해요."] },
  ],
  'j2-barista': [ // 주문 옵션 듣기
    { korean: "사이즈 어떻게 하시겠어요?", english: "What size would you like?", synonyms: ["사이즈 뭘로 할까요?", "크기 골라주세요."] },
    { korean: "시럽 추가하시겠어요?", english: "Would you like to add syrup?", synonyms: ["시럽 넣을까요?", "시럽 추가할까요?"] },
    { korean: "얼음 적게 해드릴까요?", english: "Should I give you less ice?", synonyms: ["얼음 덜 넣을까요?", "아이스 라이트로 할까요?"] },
    { korean: "휘핑크림 올릴까요?", english: "Should I add whipped cream?", synonyms: ["휘핑 추가할까요?", "크림 올려드릴까요?"] },
    { korean: "우유 종류 선택하세요.", english: "Choose your milk type.", synonyms: ["우유 뭘로 할까요?", "두유로 할래요?"] },
    { korean: "샷 추가��� 천원이에요.", english: "Extra shot is 1,000 won.", synonyms: ["샷 하나 더는 천원요.", "샷 추가 1,000원이에요."] },
    { korean: "핫으로 드릴까요?", english: "Would you like it hot?", synonyms: ["���뜻한 걸로요?", "뜨거운 거요?"] },
    { korean: "아이스로 할게요.", english: "I'll make it iced.", synonyms: ["차갑게 할게요.", "시원한 걸로요."] },
    { korean: "당도 조절돼요.", english: "You can adjust sweetness.", synonyms: ["달기 조절해요.", "덜 달게 할까요?"] },
    { korean: "컵 사이즈 업 돼요?", english: "Can I upsize the cup?", synonyms: ["사이즈 키울래요?", "큰 걸로 바꿀까요?"] },
  ],
  'j3-barista': [ // 장비 이름
    { korean: "머신 청소해요.", english: "Cleaning the machine.", synonyms: ["기계 닦아요.", "에스프레소 머신 청소해요."] },
    { korean: "그라인더 돌려요.", english: "Running the grinder.", synonyms: ["원두 갈아요.", "그라인더 켜요."] },
    { korean: "스팀 노즐 막혔어요.", english: "The steam wand is clogged.", synonyms: ["스티머 막혔어요.", "우유 거품기 안 돼요."] },
    { korean: "포터필터 갈아요.", english: "Changing the portafilter.", synonyms: ["포터 바꿔요.", "필터 교체해요."] },
    { korean: "블렌더 사용해요.", english: "Using the blender.", synonyms: ["믹서 돌려요.", "블렌더 켜요."] },
    { korean: "온도계 체크해요.", english: "Checking the thermometer.", synonyms: ["온도 확인해요.", "온도 재요."] },
    { korean: "얼음기��� 꺼내요.", english: "Getting ice from the machine.", synonyms: ["얼음 뽑아요.", "제빙기에서 가져와요."] },
    { korean: "계량 스푼 주세요.", english: "Please give me the measuring spoon.", synonyms: ["계량기 주세요.", "스푼 좀요."] },
  ],
  
  // 바리스타 - 중급
  'j4-barista': [ // 커스터마이징 받기
    { korean: "샷 몇 개 넣을까요?", english: "How many shots?", synonyms: ["샷 추가할까요?", "샷 수는요?"] },
    { korean: "우유 변경 가능해요.", english: "You can change the milk.", synonyms: ["우유 바꿀 수 있어요.", "두유로 할래요?"] },
    { korean: "저지방 우유로요.", english: "With low-fat milk.", synonyms: ["저지방으로요.", "라이트 우유로요."] },
    { korean: "무지방 있어요.", english: "We have fat-free.", synonyms: ["무지방 가능해요.", "논팻 돼요."] },
    { korean: "두유로 바꿀게요.", english: "I'll switch to soy milk.", synonyms: ["소이로 할게요.", "두유로 변경해요."] },
    { korean: "귀리우유 추천해요.", english: "I recommend oat milk.", synonyms: ["오트밀크 좋아요.", "귀리우유 어때요?"] },
    { korean: "시럽 빼드릴까요?", english: "Should I skip the syrup?", synonyms: ["시럽 안 넣을까요?", "시럽 ����외할까요?"] },
    { korean: "농도 진하게요.", english: "Make it strong.", synonyms: ["진하게 해주세요.", "샷 많이요."] },
    { korean: "연하게 해드릴까요?", english: "Should I make it mild?", synonyms: ["약하게 할까요?", "물 더 넣을까요?"] },
    { korean: "설탕 몇 개요?", english: "How many sugars?", synonyms: ["설탕 넣을까요?", "달게 할까요?"] },
    { korean: "카라멜 드리즐 추가요.", english: "Add caramel drizzle.", synonyms: ["카라멜 뿌려요.", "카라멜 소스 올려요."] },
    { korean: "초코칩 올려요.", english: "Add chocolate chips.", synonyms: ["초코 토핑 올려요.", "초콜릿 칩 추가요."] },
    { korean: "샷 많이 넣어요.", english: "Adding lots of shots.", synonyms: ["샷 추가해요.", "에스프레소 많이요."] },
    { korean: "컵 따로 주세요.", english: "Separate cups please.", synonyms: ["각각 담아주세요.", "나눠 담아요."] },
    { korean: "테이크아웃이에요.", english: "It's to-go.", synonyms: ["가져갈 거예요.", "포장이에요."] },
  ],
  'j5-barista': [ // 음료 제조 설명
    { korean: "에스프레소 추출해요.", english: "Extracting espresso.", synonyms: ["샷 뽑아요.", "에스프레소 내려요."] },
    { korean: "우유 스티밍해요.", english: "Steaming milk.", synonyms: ["우유 데워요.", "거품 만들어요."] },
    { korean: "라떼아트 그려요.", english: "Drawing latte art.", synonyms: ["예쁘게 그려요.", "하트 만들어요."] },
    { korean: "원두 갈고 있어요.", english: "Grinding beans.", synonyms: ["커피 갈아요.", "분쇄 중이에요."] },
    { korean: "물 온도 맞춰요.", english: "Adjusting water temperature.", synonyms: ["온도 조절해요.", "물 데워요."] },
    { korean: "얼음 채워요.", english: "Filling with ice.", synonyms: ["얼음 넣어요.", "아이스 많이요."] },
    { korean: "믹서에 갈아요.", english: "Blending it.", synonyms: ["블렌딩해요.", "섞어요."] },
    { korean: "시럽 먼저 넣어요.", english: "Put syrup first.", synonyms: ["시럽 바닥에 깔아요.", "시럽 먼저요."] },
    { korean: "휘핑 짜요.", english: "Squeezing whipped cream.", synonyms: ["크림 올려요.", "휘핑크림 짜요."] },
    { korean: "컵에 담아요.", english: "Pouring into the cup.", synonyms: ["컵에 부어요.", "담고 있어요."] },
  ],
  'j6-barista': [ // 재료 관리 표현
    { korean: "원두 떨어졌어요.", english: "We're out of beans.", synonyms: ["원두 없어요.", "커피콩 다 떨어졌어요."] },
    { korean: "우유 주문해요.", english: "Ordering milk.", synonyms: ["��유 발주해요.", "우유 시켜야 해요."] },
    { korean: "시럽 새 거예요.", english: "It's new syrup.", synonyms: ["시럽 바꿨어요.", "새 시럽이에요."] },
    { korean: "컵 재고 확��해요.", english: "Checking cup inventory.", synonyms: ["컵 남은 거 봐요.", "컵 몇 개 있어요?"] },
    { korean: "빨대 다 떨어졌어요.", english: "We're out of straws.", synonyms: ["빨대 없어요.", "스트로우 다 썼어요."] },
    { korean: "냅킨 보충해요.", english: "Refilling napkins.", synonyms: ["냅킨 채워요.", "냅킨 더 놔둬요."] },
    { korean: "유통기한 체크해요.", english: "Checking expiration dates.", synonyms: ["날짜 확인해요.", "기한 봐요."] },
    { korean: "재료 정리해요.", english: "Organizing ingredients.", synonyms: ["재료 정돈해요.", "냉장고 정리해요."] },
    { korean: "휘핑크림 만들어요.", english: "Making whipped cream.", synonyms: ["크림 휘핑해요.", "생크림 거품 내요."] },
    { korean: "설탕 리필해요.", english: "Refilling sugar.", synonyms: ["설탕 채워요.", "설탕 더 넣어둬요."] },
  ],

  // 캐셔 - 초급
  'j1-cashier': [ // 계산 인사하기
    { korean: "계산 도와드리겠습니다.", english: "I'll help you with the payment.", synonyms: ["계산해 드릴게요.", "결제 도와드릴게요."] },
    { korean: "여기서 계산하시면 됩니다.", english: "You can pay here.", synonyms: ["이쪽에서 결제하세요.", "여기서 하시면 돼요."] },
    { korean: "카운터로 오세요.", english: "Please come to the counter.", synonyms: ["계산대로 오세요.", "이리 와주세요."] },
    { korean: "현금 계산해요.", english: "Cash payment.", synonyms: ["현금이요.", "현금 결제예요."] },
    { korean: "카드 계산해요.", english: "Card payment.", synonyms: ["카드요.", "카드 결제예요."] },
    { korean: "잠시만 기다리세요.", english: "Please wait a moment.", synonyms: ["조금만요.", "잠깐만요."] },
    { korean: "영수증 여기 있어요.", english: "Here's your receipt.", synonyms: ["영수증이요.", "영수증 드려요."] },
    { korean: "감사합니다.", english: "Thank you.", synonyms: ["고맙습니다.", "감사해요."] },
  ],
  'j2-cashier': [ // 가격 말하기
    { korean: "전부 15,000원입니다.", english: "The total is 15,000 won.", synonyms: ["총 15,000원이에요.", "합계 만오천원입니다."] },
    { korean: "5,500원이에요.", english: "It's 5,500 won.", synonyms: ["오천오백원이요.", "5,500원입니다."] },
    { korean: "합계 3만원이에요.", english: "The total is 30,000 won.", synonyms: ["전부 30,000원이요.", "총액 3만원이에요."] },
    { korean: "8천원 나왔어요.", english: "It came to 8,000 won.", synonyms: ["8,000원 나왔어요.", "팔천원이요."] },
    { korean: "할인해서 만원이에요.", english: "With discount, it's 10,000 won.", synonyms: ["깎아서 만원이요.", "할인 적용 만원이에요."] },
    { korean: "2만 2천원이에요.", english: "It's 22,000 won.", synonyms: ["이만이천원이요.", "22,000원 나왔어요."] },
    { korean: "천원 더예요.", english: "It's 1,000 won more.", synonyms: ["천원 추가예요.", "천원 더 내세요."] },
    { korean: "정확히 1만원이에요.", english: "It's exactly 10,000 won.", synonyms: ["딱 만원이요.", "만원 정확해요."] },
    { korean: "잔돈 없어요.", english: "No change.", synonyms: ["거스름돈 없어요.", "딱 맞아요."] },
    { korean: "거스름돈 500원이에요.", english: "Your change is 500 won.", synonyms: ["잔돈 500원이요.", "거슬러 드릴 게 오백원이에요."] },
  ],
  'j3-cashier': [ // 결제 방법 묻기
    { korean: "카드로 하시겠어요?", english: "Will you pay by card?", synonyms: ["카드 결제 하실 건가요?", "카드로 할까요?"] },
    { korean: "현금으로 하시��어요?", english: "Will you pay in cash?", synonyms: ["현금 결제 하실래요?", "현금으로 내실 건가요?"] },
    { korean: "페이 되세요?", english: "Do you use mobile pay?", synonyms: ["모바일 결제 돼요?", "간편결제 하세요?"] },
    { korean: "삼성페이 돼요.", english: "Samsung Pay works.", synonyms: ["삼페 가능해요.", "삼성페이 되세요."] },
    { korean: "카카오페이 되세요?", english: "Do you use Kakao Pay?", synonyms: ["카카오 결제돼요?", "카톡페이 하세요?"] },
    { korean: "계좌이체 할까요?", english: "Should I transfer?", synonyms: ["이체 할래요?", "계좌로 보낼까요?"] },
    { korean: "신용���드만 돼요.", english: "Only credit cards.", synonyms: ["신용만 가능해요.", "체크는 안 돼요."] },
    { korean: "현금만 받아요.", english: "Cash only.", synonyms: ["카드 안 돼요.", "현금 결제만요."] },
  ],
  
  // 캐셔 - 중급
  'j4-cashier': [ // 할인 안내하기
    { korean: "쿠폰 있으세요?", english: "Do you have a coupon?", synonyms: ["할인권 있어요?", "쿠폰 쓰실래요?"] },
    { korean: "포인트 적립할까요?", english: "Should I add points?", synonyms: ["적립하실래요?", "포인트 쌓을까요?"] },
    { korean: "멤버십 있으세요?", english: "Do you have a membership?", synonyms: ["회원이세요?", "멤버십 카드 있어요?"] },
    { korean: "10% 할인돼요.", english: "You get 10% off.", synonyms: ["십퍼센트 깎여요.", "10프로 할인이에요."] },
    { korean: "���늘 20% 세일이에요.", english: "It's 20% off today.", synonyms: ["오늘 이십퍼 행사예요.", "20% 할인 중이에요."] },
    { korean: "포인트 사용하실래요?", english: "Would you like to use points?", synonyms: ["포���트 쓸래요?", "적립금 쓰세요?"] },
    { korean: "2천원 할인됐어요.", english: "You saved 2,000 won.", synonyms: ["이천원 깎였어요.", "2,000원 빠졌어요."] },
    { korean: "세트로 사면 싸��.", english: "It's cheaper as a set.", synonyms: ["세트가 저렴해요.", "묶음이 이득이에요."] },
    { korean: "1+1 행사예요.", english: "It's a buy one get one.", synonyms: ["하나 더 드려요.", "원플러스원이에요."] },
    { korean: "카드 할인 돼요.", english: "Card discount available.", synonyms: ["이 카드 깎여요.", "카드 혜택 있어요."] },
  ],
  'j5-cashier': [ // 영수증 처리하기
    { korean: "영수증 필요하세요?", english: "Do you need a receipt?", synonyms: ["영수증 드릴까요?", "영수증 받으실래요?"] },
    { korean: "현금영수증 하실��요?", english: "Would you like a cash receipt?", synonyms: ["현금영수증 할까요?", "현영 하세요?"] },
    { korean: "전화번호 말씀하세요.", english: "Please tell me your phone number.", synonyms: ["번호 알려주��요.", "핸드폰 번호요."] },
    { korean: "이메일로 보낼게요.", english: "I'll send it by email.", synonyms: ["이메일 영수증이요.", "메일로 드릴게요."] },
    { korean: "출력해 드릴까요?", english: "Should I print it?", synonyms: ["종이로 드릴까요?", "프린트할까요?"] },
    { korean: "영수증 여기 있어요.", english: "Here's your receipt.", synonyms: ["영수증이요.", "영수증 드려요."] },
    { korean: "사업자 영수증이요.", english: "Business receipt.", synonyms: ["세금계산서요.", "사업자용이요."] },
    { korean: "간이��수증 돼요.", english: "We can give a simple receipt.", synonyms: ["간이로 드릴게요.", "간단한 영수증이요."] },
    { korean: "카드 전표 주세요.", english: "Please give me the card slip.", synonyms: ["카드 영수증 주세요.", "전표 주세���."] },
    { korean: "서명해 주세요.", english: "Please sign here.", synonyms: ["사인 부탁해요.", "여기 서명하세요."] },
  ],
  'j6-cashier': [ // 거스름돈 주기
    { korean: "거스름돈 확인하세요.", english: "Please check your change.", synonyms: ["잔돈 세어보세요.", "거스름돈 맞는지 봐요."] },
    { korean: "만원 거슬러 드려요.", english: "Here's 10,000 won change.", synonyms: ["만원 잔돈이에요.", "거스름돈 만원이요."] },
    { korean: "잔돈 500원이에요.", english: "Your change is 500 won.", synonyms: ["오백원 거슬러요.", "500원 받으세요."] },
    { korean: "동전 없어요.", english: "No coins.", synonyms: ["잔돈 없어요.", "동전 떨어졌어요."] },
    { korean: "천원짜리로 바꿔줄까요?", english: "Should I give you in 1,000 won bills?", synonyms: ["천원으로 줄까요?", "잔돈 많이 드릴까요?"] },
    { korean: "큰 돈으로 드릴게요.", english: "I'll give you large bills.", synonyms: ["큰 지폐로요.", "만원짜리로 드려요."] },
    { korean: "잔돈 맞아요?", english: "Is the change correct?", synonyms: ["거스름돈 확인했어요?", "잔돈 맞죠?"] },
    { korean: "봉투에 넣어드릴게요.", english: "I'll put it in an envelope.", synonyms: ["봉투 드릴게요.", "여기 담아드려요."] },
    { korean: "돈 다시 세어보세요.", english: "Please count the money again.", synonyms: ["한 번 더 세어보세요.", "확인해 보세요."] },
    { korean: "잔돈 부족해요.", english: "We're short on change.", synonyms: ["거슬러줄 돈 없어요.", "잔돈이 모자라요."] },
  ],

  // 배달 - 초급
  'j1-delivery': [ // 주소 확인하기
    { korean: "주소가 어떻게 되세요?", english: "What is your address?", synonyms: ["주소 알려주세요.", "어디로 배달 드릴까요?"] },
    { korean: "몇 호예요?", english: "What unit number?", synonyms: ["호수가 어떻게 되세요?", "몇 호실이에요?"] },
    { korean: "건물 이름 말씀해 주세요.", english: "Please tell me the building name.", synonyms: ["건물명 알려주세요.", "빌딩 이름이 뭐예요?"] },
    { korean: "동이 몇 동이에요?", english: "Which building number?", synonyms: ["몇 동인가요?", "동 번호 알려주세요."] },
    { korean: "층수 알려주세요.", english: "Please tell me the floor.", synonyms: ["몇 층이에요?", "층 번호요."] },
    { korean: "아파트 이름 뭐예요?", english: "What's the apartment name?", synonyms: ["아파트 단지명이요.", "아파트가 뭐예요?"] },
    { korean: "상세 주소 말씀하세요.", english: "Please give me detailed address.", synonyms: ["자세한 주소요.", "세부 주소 알려주세요."] },
    { korean: "랜드마크 있어요?", english: "Is there a landmark?", synonyms: ["근처에 뭐 있��요?", "표지판 있나요?"] },
    { korean: "골목 안쪽이에요?", english: "Is it inside the alley?", synonyms: ["골목 들어가요?", "안쪽인가요?"] },
    { korean: "찾기 쉬워요?", english: "Is it easy to find?", synonyms: ["잘 보여요?", "찾을 수 있어요?"] },
  ],
  'j2-delivery': [ // 전화 응대하기
    { korean: "네, 배달입니다.", english: "Yes, this is delivery.", synonyms: ["배달 왔어요.", "배달 전화예요."] },
    { korean: "지금 가고 있습니다.", english: "I'm on my way now.", synonyms: ["지금 가는 중이에요.", "곧 도착합니다."] },
    { korean: "10분 후에 도착해요.", english: "I'll arrive in 10 minutes.", synonyms: ["10분 ���에 가요.", "십 분 걸려요."] },
    { korean: "길이 막혀요.", english: "Traffic is heavy.", synonyms: ["차가 많아요.", "도로가 막혔어요."] },
    { korean: "늦어서 죄송합니다.", english: "Sorry I'm late.", synonyms: ["늦어서 미안해요.", "늦었어요."] },
    { korean: "전화 주셔서 감사해요.", english: "Thank you for calling.", synonyms: ["연락 고마워요.", "전화해 주셔서 감사합니다."] },
    { korean: "주문 확인할게요.", english: "Let me check the order.", synonyms: ["주문 봐요.", "확인해 볼게요."] },
    { korean: "맞습니다.", english: "That's correct.", synonyms: ["네 맞아요.", "정확해요."] },
  ],
  'j3-delivery': [ // 도착 알리기
    { korean: "문 앞에 도착했습니다.", english: "I've arrived at your door.", synonyms: ["문 앞이에요.", "도착했어요."] },
    { korean: "벨 눌렀습니다.", english: "I rang the bell.", synonyms: ["초인종 눌렀어요.", "벨 눌렀어요."] },
    { korean: "1층 입구예요.", english: "I'm at the 1st floor entrance.", synonyms: ["아래층 현관이요.", "일층이에요."] },
    { korean: "엘리베이터 타고 올라가요.", english: "Taking the elevator up.", synonyms: ["엘베 타요.", "올라갈게요."] },
    { korean: "계단으로 갈게요.", english: "I'll take the stairs.", synonyms: ["걸어 올라가요.", "계단 이용해요."] },
    { korean: "주차장에 있어요.", english: "I'm in the parking lot.", synonyms: ["주차장이요.", "주차장에 섰어요."] },
    { korean: "문 열어주세요.", english: "Please open the door.", synonyms: ["문 좀 열어주세요.", "문 열어요."] },
    { korean: "밖에 나와주세요.", english: "Please come outside.", synonyms: ["나와주세요.", "밖으로 나와요."] },
  ],
  
  // 배달 - 중급
  'j4-delivery': [ // 길 찾기 표현
    { korean: "길을 잘 모르겠어요.", english: "I can't find the way.", synonyms: ["길 찾기 어려워요.", "어디가 어딘지 모르겠어요."] },
    { korean: "어느 방향이에요?", english: "Which direction?", synonyms: ["어디로 가요?", "방향이 ���디예요?"] },
    { korean: "왼쪽으로 가요?", english: "Should I go left?", synonyms: ["왼쪽인가요?", "좌회전해요?"] },
    { korean: "오른쪽이에요.", english: "It's on the right.", synonyms: ["우측이에요.", "오른편이에요."] },
    { korean: "직진하세요.", english: "Go straight.", synonyms: ["쭉 가세요.", "앞으로 가요."] },
    { korean: "돌아가야 해요.", english: "I need to turn around.", synonyms: ["유턴해야 해요.", "반대로 가야 해요."] },
    { korean: "골목 안으로요.", english: "Into the alley.", synonyms: ["골목길로요.", "샛길로 가요."] },
    { korean: "큰길로 나가요.", english: "Going to the main road.", synonyms: ["대로로 나가요.", "큰 도로로요."] },
    { korean: "다리 건너요.", english: "Crossing the bridge.", synonyms: ["다리 건너편이요.", "다리 지나요."] },
    { korean: "신호등 지나서요.", english: "Past the traffic light.", synonyms: ["신호 지나면요.", "신호등 넘어서요."] },
    { korean: "가까워졌어요.", english: "I'm getting close.", synonyms: ["거의 다 왔어요.", "근처예요."] },
    { korean: "찾았어요.", english: "I found it.", synonyms: ["도착했어요.", "여기네요."] },
  ],
  'j5-delivery': [ // 지연 안내하기
    { korean: "좀 늦을 것 같아요.", english: "I might be a bit late.", synonyms: ["늦어질 것 같아요.", "시간 좀 걸려요."] },
    { korean: "교통이 막혀요.", english: "Traffic is jammed.", synonyms: ["차가 안 가요.", "길이 밀려요."] },
    { korean: "사고가 났어요.", english: "There was an accident.", synonyms: ["사고 때문이에요.", "교통사고예요."] },
    { korean: "10분 더 걸려요.", english: "It'll take 10 more minutes.", synonyms: ["십 분 더요.", "10분 늦어요."] },
    { korean: "최대한 빨리 갈게요.", english: "I'll go as fast as I can.", synonyms: ["빨리 갈게요.", "서둘러요."] },
    { korean: "배달 많아서요.", english: "There are many deliveries.", synonyms: ["주문이 많아요.", "배달 건수가 많아요."] },
    { korean: "날씨가 안 좋아요.", english: "The weather is bad.", synonyms: ["비가 와요.", "날씨 때문이에요."] },
    { korean: "눈이 와요.", english: "It's snowing.", synonyms: ["눈 때문에요.", "눈길이에요."] },
    { korean: "길이 미끄러워요.", english: "The road is slippery.", synonyms: ["빙판길이에요.", "조심히 가요."] },
    { korean: "이해해 주세요.", english: "Please understand.", synonyms: ["양해 부탁해요.", "죄송해요."] },
  ],
  'j6-delivery': [ // 물건 전달하기
    { korean: "음식 받으세요.", english: "Here's your food.", synonyms: ["음식 나왔어요.", "주문하신 거예요."] },
    { korean: "확인해 보세요.", english: "Please check it.", synonyms: ["체크해 주세요.", "봐주세요."] },
    { korean: "수저 넣었어요.", english: "I included utensils.", synonyms: ["수저 같이 있어요.", "수저 들어있어요."] },
    { korean: "소스 빠졌어요?", english: "Is sauce missing?", synonyms: ["소스 없나요?", "양념 안 들어갔어요?"] },
    { korean: "영수증 여기요.", english: "Here's the receipt.", synonyms: ["영수증이요.", "영수증 드려요."] },
    { korean: "주문 맞나요?", english: "Is the order correct?", synonyms: ["주문 확인하세요.", "맞죠?"] },
    { korean: "다 들어있어요.", english: "Everything is in there.", synonyms: ["전부 있어요.", "빠진 거 없어요."] },
    { korean: "따뜻할 때 드세요.", english: "Eat it while it's hot.", synonyms: ["금방 드세요.", "뜨거울 때 드세요."] },
    { korean: "맛있게 드세요.", english: "Enjoy your meal.", synonyms: ["맛있게 먹어요.", "잘 드세요."] },
    { korean: "안녕히 계세요.", english: "Goodbye.", synonyms: ["다음에 또요.", "감사합니다."] },
  ],

  // 주방장 - 초급
  'j1-chef': [ // 레시피 용어
    { korean: "200그램 넣으세요.", english: "Put in 200 grams.", synonyms: ["200g 넣어주세요.", "이백 그램 추가하세요."] },
    { korean: "180도로 예열하세요.", english: "Preheat to 180 degrees.", synonyms: ["180도 예열해주세요.", "오븐 180도로 데우세요."] },
    { korean: "한 스푼만요.", english: "Just one spoon.", synonyms: ["스푼 하나요.", "한 숟가락만요."] },
    { korean: "컵으로 재세요.", english: "Measure with a cup.", synonyms: ["계량컵 쓰세요.", "컵 단위로요."] },
    { korean: "칼로 썰어요.", english: "Slice with a knife.", synonyms: ["칼질하세요.", "썰어주세요."] },
    { korean: "온도 확인하세요.", english: "Check the temperature.", synonyms: ["온도 재보세요.", "몇 도인지 봐요."] },
    { korean: "무게 달아요.", english: "Weigh it.", synonyms: ["저울로 재요.", "무게 확인해요."] },
    { korean: "불 조절하세요.", english: "Adjust the heat.", synonyms: ["화력 맞추세요.", "불 조절해요."] },
    { korean: "타��머 맞춰요.", english: "Set the timer.", synonyms: ["시간 재세요.", "타이머 설정해요."] },
    { korean: "맛 봐주세요.", english: "Please taste it.", synonyms: ["맛 확인하세요.", "맛 좀 봐요."] },
  ],
  'j2-chef': [ // 조리법 설명하기
    { korean: "먼저 야채를 볶으세요.", english: "First, stir-fry the vegetables.", synonyms: ["야채부터 볶아���세요.", "채소 먼저 볶으세요."] },
    { korean: "5분 동안 끓이세요.", english: "Boil for 5 minutes.", synonyms: ["5분간 끓여주세요.", "오분 ��도 끓이세요."] },
    { korean: "계란을 풀어요.", english: "Beat the eggs.", synonyms: ["달걀 푸세요.", "계란 저어요."] },
    { korean: "양념에 재워요.", english: "Marinate in seasoning.", synonyms: ["양념 묻혀요.", "재워두세요."] },
    { korean: "밀가루 입혀요.", english: "Coat with flour.", synonyms: ["가루 묻혀요.", "밀가루 뿌려요."] },
    { korean: "빵가루 묻혀요.", english: "Bread with crumbs.", synonyms: ["빵가루 입혀요.", "튀김옷 입혀요."] },
    { korean: "물 조금만 넣어요.", english: "Add just a little water.", synonyms: ["물 살짝만요.", "물 적게요."] },
    { korean: "간장으로 간해요.", english: "Season with soy sauce.", synonyms: ["간장 넣어요.", "간장으로 맛내요."] },
    { korean: "소금으로 간 맞춰요.", english: "Season with salt.", synonyms: ["소금 넣어요.", "소금으로 조절해요."] },
    { korean: "거품 제거하세요.", english: "Remove the foam.", synonyms: ["거품 걷어내요.", "거품 버려요."] },
  ],
  'j3-chef': [ // 주방 지시하기
    { korean: "이거 빨리 해주세요.", english: "Please do this quickly.", synonyms: ["이것 서둘러 주세요.", "급하니까 빨리 해요."] },
    { korean: "저기 정리 좀 해주세요.", english: "Please clean up over there.", synonyms: ["저쪽 치워주세요.", "정리 부탁해요."] },
    { korean: "야채 준비하세요.", english: "Prepare the vegetables.", synonyms: ["채소 손질하세요.", "야채 다듬어요."] },
    { korean: "고기 썰어주세요.", english: "Please cut the meat.", synonyms: ["고기 자르세요.", "고기 손질해요."] },
    { korean: "물 끓여주세요.", english: "Please boil water.", synonyms: ["물 데워주세요.", "물 좀 끓여요."] },
    { korean: "접시 데우세요.", english: "Warm the plates.", synonyms: ["접시 예열하세요.", "��릇 따뜻하게 해요."] },
    { korean: "소스 만들어요.", english: "Make the sauce.", synonyms: ["소스 준비하세요.", "양념 만들어요."] },
    { korean: "이거 다시 해요.", english: "Redo this.", synonyms: ["다시 만들어요.", "새로 해주세요."] },
  ],
  
  // 주방장 - 중급
  'j4-chef': [ // 식재료 주문하기
    { korean: "발주 ��을게요.", english: "I'll place an order.", synonyms: ["주문할게요.", "발주 하겠습니다."] },
    { korean: "재고 확인하세요.", english: "Check the inventory.", synonyms: ["재고 봐주세요.", "남은 거 체크하세요."] },
    { korean: "양파 10kg 주문해요.", english: "Ordering 10kg of onions.", synonyms: ["양파 십 키로요.", "양파 10kg 시켜요."] },
    { korean: "고기 신선한 거로요.", english: "Fresh meat please.", synonyms: ["고기 좋은 걸로요.", "신선한 육류요."] },
    { korean: "유통기한 짧아요.", english: "The expiration date is soon.", synonyms: ["기한 얼마 안 남았어요.", "빨리 써야 해요."] },
    { korean: "재료 빨리 와요?", english: "Will ingredients come soon?", synonyms: ["언제 도착해요?", "배송 빨라요?"] },
    { korean: "가격 올랐어요.", english: "The price went up.", synonyms: ["값이 비싸졌어요.", "가격 인상됐어요."] },
    { korean: "세일 중이에요.", english: "It's on sale.", synonyms: ["할인 중이에요.", "싸게 팔아요."] },
    { korean: "거래처 바꿀까요?", english: "Should we change suppliers?", synonyms: ["업체 바꿀래요?", "다른 데서 살까요?"] },
    { korean: "계약 갱신해요.", english: "Renewing the contract.", synonyms: ["계약 다시 해요.", "재계약해요."] },
  ],
  'j5-chef': [ // 메뉴 개발 표현
    { korean: "새 메뉴 개발해요.", english: "Developing a new menu.", synonyms: ["신메뉴 만들어요.", "메뉴 개발 중이에요."] },
    { korean: "이렇게 해볼까요?", english: "Shall we try it this way?", synonyms: ["이렇게 해봐요.", "이 방법 어때요?"] },
    { korean: "맛 테스트 해요.", english: "Doing a taste test.", synonyms: ["시식해 봐요.", "맛 봐주세요."] },
    { korean: "레시피 수정해요.", english: "Modifying the recipe.", synonyms: ["조리법 바꿔요.", "레시피 고쳐요."] },
    { korean: "재료 바꿔볼게요.", english: "I'll try changing ingredients.", synonyms: ["다른 재료 써봐요.", "재료 교체해요."] },
    { korean: "시즌 메뉴예요.", english: "It's a seasonal menu.", synonyms: ["계절 메뉴요.", "한정 메뉴예요."] },
    { korean: "건강식으로 해요.", english: "Making it healthy.", synonyms: ["건강하게 만들어요.", "저칼로리로요."] },
    { korean: "플레이팅 바꿔요.", english: "Changing the plating.", synonyms: ["담음새 바꿔요.", "예쁘게 담아요."] },
    { korean: "원가 계산해요.", english: "Calculating the cost.", synonyms: ["비용 따져봐요.", "원가 봐요."] },
    { korean: "시장 조사 중이에요.", english: "Doing market research.", synonyms: ["리서치해요.", "조사 중이에요."] },
  ],
  'j6-chef': [ // 품질 관리하기
    { korean: "맛 괜찮아요?", english: "Does it taste okay?", synonyms: ["맛 어때요?", "맛 좋아요?"] },
    { korean: "간이 싱거워요.", english: "It's bland.", synonyms: ["간 부족해요.", "싱거워요."] },
    { korean: "너무 짜요.", english: "It's too salty.", synonyms: ["짜요.", "간이 세요."] },
    { korean: "매워��.", english: "It's spicy.", synonyms: ["맵네요.", "매운 맛이에요."] },
    { korean: "더 익혀야 해요.", english: "It needs more cooking.", synonyms: ["덜 익었어요.", "더 해야 해요."] },
    { korean: "탔어요.", english: "It's burnt.", synonyms: ["타버렸어요.", "까맣게 됐어요."] },
    { korean: "신선도 체크해요.", english: "Checking freshness.", synonyms: ["신선한지 봐요.", "상태 확인해요."] },
    { korean: "색깔이 이상해요.", english: "The color is strange.", synonyms: ["색이 안 좋아요.", "색���이 이상해요."] },
    { korean: "냄새 맡아봐��.", english: "Smell it.", synonyms: ["냄새 확인하세요.", "향 좀 봐요."] },
    { korean: "폐기하세요.", english: "Dispose of it.", synonyms: ["버리세요.", "못 쓰겠어요."] },
  ],

  // 설거지 - 초급
  'j1-dishwasher': [ // 주방 도구 이름
    { korean: "접시 다 씻었어요.", english: "I washed all the plates.", synonyms: ["접시 세척 끝났어요.", "접시 다 깨끗해요."] },
    { korean: "컵이 어디 있어요?", english: "Where are the cups?", synonyms: ["컵 위치 알려주세요.", "컵 어디 있죠?"] },
    { korean: "수저를 닦았습니다.", english: "I wiped the utensils.", synonyms: ["수저 다 닦았어요.", "수저 깨끗이 했어요."] },
    { korean: "그릇 가져왔어요.", english: "I brought the bowls.", synonyms: ["그릇 왔어요.", "식기 가져왔어요."] },
    { korean: "냄비 씻을게요.", english: "I'll wash the pot.", synonyms: ["냄비 닦을게요.", "냄비 할게요."] },
    { korean: "도마 깨끗해요.", english: "The cutting board is clean.", synonyms: ["도마 다 했어요.", "도마 깨끗이 했어요."] },
    { korean: "칼 조심하세요.", english: "Be careful with the knife.", synonyms: ["칼 위험해요.", "칼 다칠 수 있어요."] },
    { korean: "프라이팬 무거워요.", english: "The frying pan is heavy.", synonyms: ["팬 무겁네요.", "프라이팬 힘들어요."] },
    { korean: "유리컵 깨졌어요.", english: "The glass broke.", synonyms: ["유리 깨졌어��.", "컵 깨졌어요."] },
    { korean: "숟가락 어디예요?", english: "Where are the spoons?", synonyms: ["스푼 어디 있어요?", "숟가락 위치요."] },
  ],
  'j2-dishwasher': [ // 세척 용품 이름
    { korean: "세제가 떨어졌어요.", english: "We're out of detergent.", synonyms: ["세제 없어요.", "세제 다 떨어졌어요."] },
    { korean: "수세미 새 것 주세요.", english: "Please give me a new sponge.", synonyms: ["수세미 바꿔주세요.", "새 수세미 필요해요."] },
    { korean: "고무장갑 껴요.", english: "Putting on rubber gloves.", synonyms: ["장갑 끼세요.", "고무장갑 착용해요."] },
    { korean: "행주가 더러워요.", english: "The dishcloth is dirty.", synonyms: ["행주 지저분해요.", "행주 빨아야 해요."] },
    { korean: "솔로 문질러요.", english: "Scrubbing with a brush.", synonyms: ["솔 써요.", "브러시로 닦아요."] },
    { korean: "따뜻한 물이요.", english: "Warm water please.", synonyms: ["뜨거운 물로요.", "온수요."] },
    { korean: "헹궈야 해요.", english: "Need to rinse.", synonyms: ["물로 헹궈요.", "씻어내요."] },
    { korean: "표백제 쓸까요?", english: "Should I use bleach?", synonyms: ["락스 쓸래요?", "표백할까요?"] },
  ],
  'j3-dishwasher': [ // 기본 업무 표현
    { korean: "그릇을 정리하겠습니다.", english: "I'll organize the dishes.", synonyms: ["그릇 정리할게요.", "식기 정돈하겠어요."] },
    { korean: "물기를 닦아주세요.", english: "Please wipe off the water.", synonyms: ["물 닦아주세요.", "물기 제거해 주세요."] },
    { korean: "씻어서 놔뒀어요.", english: "I washed and left them.", synonyms: ["씻어놨어요.", "세척해 뒀어요."] },
    { korean: "말리고 있어요.", english: "Drying them.", synonyms: ["건조 중이에요.", "말려요."] },
    { korean: "쌓아둘게요.", english: "I'll stack them.", synonyms: ["포개 둘게요.", "쌓아놓을게요."] },
    { korean: "정리 다 했어요.", english: "I'm done organizing.", synonyms: ["정리 끝났어요.", "정돈 완료했어요."] },
    { korean: "물 버려요.", english: "Emptying the water.", synonyms: ["물 쏟아요.", "물 비워요."] },
    { korean: "다시 씻을게요.", english: "I'll wash it again.", synonyms: ["재세척할게요.", "다시 할게요."] },
  ],
  
  // 설거지 - 중급
  'j4-dishwasher': [ // 위생 관리하기
    { korean: "소독했습니다.", english: "I sanitized it.", synonyms: ["살균했어요.", "소독 완료했어요."] },
    { korean: "뜨거운 물로 헹궈요.", english: "Rinse with hot water.", synonyms: ["온수로 씻어요.", "따뜻한 물로 헹궈요."] },
    { korean: "건조대에 올려요.", english: "Put it on the drying rack.", synonyms: ["건조기에 놔요.", "말리는 곳에 놔요."] },
    { korean: "자연 건조시켜요.", english: "Air drying.", synonyms: ["바람으로 말려요.", "그냥 말려��."] },
    { korean: "행주 삶았어요.", english: "I boiled the dishcloths.", synonyms: ["행주 끓였어요.", "행주 소독했어요."] },
    { korean: "칼 따로 씻어요.", english: "Wash knives separately.", synonyms: ["칼 별도로요.", "칼 조심히 씻어요."] },
    { korean: "기름때 안 빠져요.", english: "Grease won't come off.", synonyms: ["기름이 안 지워져요.", "기름때 심해요."] },
    { korean: "더러운 것부터요.", english: "Dirty ones first.", synonyms: ["지저분한 거부터요.", "더러운 것 먼저요."] },
    { korean: "싱���대 청소해요.", english: "Cleaning the sink.", synonyms: ["개수대 닦아요.", "싱크 청소해요."] },
    { korean: "배수구 막혔어요.", english: "The drain is clogged.", synonyms: ["하수구 막혔���요.", "물이 안 빠져요."] },
  ],
  'j5-dishwasher': [ // 식기 분류하기
    { korean: "크기별로 정리해요.", english: "Organizing by size.", synonyms: ["사이즈별로 나눠요.", "크기 맞춰 놔요."] },
    { korean: "접시는 여기요.", english: "Plates go here.", synonyms: ["접시 이쪽이요.", "접시는 여기에요."] },
    { korean: "컵은 저쪽이에요.", english: "Cups go over there.", synonyms: ["컵 저기요.", "컵은 저쪽에요."] },
    { korean: "유리는 따로���.", english: "Glass separately.", synonyms: ["유리 별도로요.", "유리제품 따로요."] },
    { korean: "스테인리스는 여기요.", english: "Stainless steel here.", synonyms: ["스텐 여기요.", "쇠그릇 이쪽이요."] },
    { korean: "플라스틱 그릇이요.", english: "Plastic bowls.", synonyms: ["플라스틱이요.", "합성수지요."] },
    { korean: "도자기 조심해요.", english: "Be careful with ceramics.", synonyms: ["사기그릇 주의해요.", "도자기 깨져요."] },
    { korean: "냄비는 따로요.", english: "Pots separately.", synonyms: ["냄비 별도요.", "냄비류는 따로요."] },
    { korean: "선반에 올려요.", english: "Put on the shelf.", synonyms: ["선반 위에요.", "찬장��� 올려요."] },
    { korean: "보관함에 넣어요.", english: "Put in the container.", synonyms: ["수납함에요.", "보관해요."] },
  ],
  'j6-dishwasher': [ // 기계 사용하기
    { korean: "식기��척기 돌려요.", english: "Running the dishwasher.", synonyms: ["세척기 작동해요.", "기계 켜요."] },
    { korean: "세제 넣었어요.", english: "I added detergent.", synonyms: ["세제 투입했어요.", "세제 넣었어요."] },
    { korean: "문 닫으세요.", english: "Close the door.", synonyms: ["뚜껑 닫아요.", "문 닫아요."] },
    { korean: "버튼 눌러요.", english: "Pressing the button.", synonyms: ["스위치 켜요.", "버튼 눌러요."] },
    { korean: "시간 설정해요.", english: "Setting the time.", synonyms: ["타이머 맞춰요.", "시간 조절해요."] },
    { korean: "다 끝났어요.", english: "It's finished.", synonyms: ["완료됐어요.", "끝났어요."] },
    { korean: "뜨거우니 조심해요.", english: "It's hot, be careful.", synonyms: ["뜨거워요.", "조심하세요."] },
    { korean: "기계 고장났어요.", english: "The machine is broken.", synonyms: ["기계 안 돼요.", "고장이에요."] },
    { korean: "수리 필요해요.", english: "Need repair.", synonyms: ["고쳐야 해요.", "수리 불러요."] },
    { korean: "물이 새요.", english: "Water is leaking.", synonyms: ["물 흘러요.", "누수돼요."] },
  ],
};

// 문장별 학습 상태 타입
interface SentenceLearningState {
  attempts: number; // 시도 횟수
  score: number; // 점수
  passed: boolean; // 통과 여부
  needsMorePractice: boolean; // 추가 연습 필요 여부
}

export function SentenceLearningScreen({ onNavigate, onBack, chapter, onComplete }: SentenceLearningScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSynonyms, setShowSynonyms] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(0); // 현재 문장의 시도 횟수 (최대 3회)
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false); // TTS 재생 중 상태
  
  // 각 문장별 학습 상태 저장
  const [sentenceLearningStates, setSentenceLearningStates] = useState<Record<number, SentenceLearningState>>({});

  const handleBackClick = () => {
    if (onBack) {
      onBack('chapterList');
    } else {
      onNavigate('chapterList');
    }
  };

  // 챕터에 맞는 문장 가져오기
  const getSentences = () => {
    if (!chapter) {
      // 기본 문장 (챕터 정보가 없을 때)
      return [
        {
          korean: "손님, 계산 도와드리겠습니다.",
          english: "Customer, I'll help you with the payment.",
          synonyms: ["손님, 계산해 드릴게요.", "손님, 결제 도와드리겠습니다."]
        }
      ];
    }

    // 챕터 ID로 문장 찾기
    const sentenceKey = chapter.id;
    
    // 직무별 문장인 경우 (type이 'job'인 경우)
    if (chapter.type === 'job' && chapter.jobType) {
      const jobKey = `${sentenceKey}-${chapter.jobType}`;
      if (chapterSentences[jobKey]) {
        return chapterSentences[jobKey];
      }
    }
    
    // 일반 챕터 문장
    if (chapterSentences[sentenceKey]) {
      return chapterSentences[sentenceKey];
    }

    // 문장이 없으면 기본 문장 반환
    return [
      {
        korean: "이 챕터의 문장이 준비 중입니다.",
        english: "Sentences for this chapter are being prepared.",
        synonyms: ["곧 업데이트 예정입니다."]
      }
    ];
  };

  const sentences = getSentences();
  const currentSentence = sentences[currentIndex];
  const progress = (Object.keys(sentenceLearningStates).filter(key => sentenceLearningStates[parseInt(key)].passed).length / sentences.length) * 100;
  const isCompleted = sentenceLearningStates[currentIndex]?.passed || sentenceLearningStates[currentIndex]?.needsMorePractice;

  // TTS 발음 듣기 (나중에 삭제 - 백엔드 TTS API로 대체 예정)
  const handlePlayPronunciation = () => {
    if (isPlaying) {
      // 재생 중이��� 중지
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Web Speech API 사용 (나중에 삭제)
    const utterance = new SpeechSynthesisUtterance(currentSentence.korean);
    utterance.lang = 'ko-KR'; // 한국어 설정
    utterance.rate = 0.9; // 약간 느리게 (학습용)
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // 음성 인식 시작 (나중에 백엔드 AI 발음 평가 API로 교체 필요)
  const handleStartRecording = async () => {
    // Web Speech Recognition API 사용 (나중에 백엔드 AI 발음 평가 API로 교체)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      // 브라우저가 지원하지 않는 경우 시뮬레이션으로 폴백
      toast.info('음성 인식 미지원 브라우저', {
        description: '시뮬레이션 모드로 진행합니다.',
        duration: 3000,
      });
      simulateRecording();
      return;
    }

    // 마이크 권한 먼저 확인 및 요청
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error: any) {
      // 권한 거부 시 시뮬레이션 모드로 전환
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast.error('마이크 권한이 필요합니다', {
          description: '브라우저 설정에서 마이크 권한을 허용해주세요. 시뮬레이션 모드로 진행합니다.',
          duration: 5000,
        });
      } else {
        toast.warning('마이크 접근 오류', {
          description: '시뮬레이션 모드로 진행합니다.',
          duration: 3000,
        });
      }
      simulateRecording();
      return;
    }

    setIsRecording(true);

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      
      setIsRecording(false);
      
      // 인식된 텍스트와 정답 비교하여 점수 계산
      const score = calculateScore(transcript, currentSentence.korean, confidence);
      const passed = score >= 80;
      const newAttempt = currentAttempt + 1;
      
      // 피드백 데이터 생성
      const feedback = {
        score,
        passed,
        attempt: newAttempt,
        maxAttempts: 3,
        recognizedText: transcript,
        correctParts: score >= 80 
          ? currentSentence.korean.split(' ').slice(0, -1)
          : currentSentence.korean.split(' ').slice(0, -2),
        incorrectParts: score < 80
          ? [
              { 
                word: currentSentence.korean.split(' ').slice(-1)[0], 
                issue: score < 70 ? "발음이 부정확합니다" : "억양이 부자연스럽습니다" 
              }
            ]
          : [],
        improvements: score < 80
          ? ["발음을 더 또박또박 해보세요", "자연스러운 억양으로 말해보세요"]
          : []
      };
      
      setLastFeedback(feedback);
      setCurrentAttempt(newAttempt);
      setShowFeedback(true);
      
      // 문장 학습 상태 업데이트
      if (passed || newAttempt >= 3) {
        setSentenceLearningStates(prev => ({
          ...prev,
          [currentIndex]: {
            attempts: newAttempt,
            score,
            passed,
            needsMorePractice: !passed
          }
        }));
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      
      // 마이크 권한 거부 에러 처리
      if (event.error === 'not-allowed') {
        toast.error('마이크 권한이 필요합니다', {
          description: '브라우저 설정에서 마이크 권한을 허용해주세요. 시뮬레이션 모드로 진행합니다.',
          duration: 5000,
        });
      } else if (event.error === 'no-speech') {
        toast.warning('음성이 감지되지 않았습니다', {
          description: '다시 시도해주세요.',
          duration: 3000,
        });
        return; // 다시 시도할 수 있도록 폴백하지 않음
      }
      
      // 에러 발생 시 시뮬레이션으로 폴백
      simulateRecording();
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // 텍스트 유사도 기반 점수 계산 (나중에 삭제 - 백엔드 AI가 대체)
  const calculateScore = (recognized: string, correct: string, confidence: number): number => {
    // 간단한 유사도 계산 (Levenshtein distance 기반)
    const cleanRecognized = recognized.replace(/\s+/g, '').toLowerCase();
    const cleanCorrect = correct.replace(/\s+/g, '').toLowerCase();
    
    if (cleanRecognized === cleanCorrect) return 100;
    
    const maxLength = Math.max(cleanRecognized.length, cleanCorrect.length);
    const distance = levenshteinDistance(cleanRecognized, cleanCorrect);
    const similarity = ((maxLength - distance) / maxLength) * 100;
    
    // confidence와 유사도를 조합하여 최종 점수 계산
    return Math.round(similarity * 0.7 + confidence * 100 * 0.3);
  };

  // Levenshtein distance 계산 (나중에 삭제)
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // 시뮬레이션 폴백 (브라우저 미지원 시)
  const simulateRecording = () => {
    setTimeout(() => {
      setIsRecording(false);
      
      const score = Math.floor(Math.random() * 30) + 70;
      const passed = score >= 80;
      const newAttempt = currentAttempt + 1;
      
      const feedback = {
        score,
        passed,
        attempt: newAttempt,
        maxAttempts: 3,
        correctParts: score >= 80 
          ? currentSentence.korean.split(' ').slice(0, -1)
          : currentSentence.korean.split(' ').slice(0, -2),
        incorrectParts: score < 80
          ? [
              { 
                word: currentSentence.korean.split(' ').slice(-1)[0], 
                issue: score < 70 ? "발음이 부정확합니다" : "억양이 부자연스럽습니다" 
              }
            ]
          : [],
        improvements: score < 80
          ? ["발음을 더 또박또박 해보세요", "자연스러운 억양으로 말해보세요"]
          : []
      };
      
      setLastFeedback(feedback);
      setCurrentAttempt(newAttempt);
      setShowFeedback(true);
      
      if (passed || newAttempt >= 3) {
        setSentenceLearningStates(prev => ({
          ...prev,
          [currentIndex]: {
            attempts: newAttempt,
            score,
            passed,
            needsMorePractice: !passed
          }
        }));
      }
    }, 2000);
  };

  // 문장 피드백 확인 후 다음 행동
  const handleSentenceFeedbackAction = (action: 'retry' | 'next') => {
    setShowFeedback(false);
    
    if (action === 'retry') {
      // 3회 시도 후 "다시 연습하기"를 누른 경우에만 시도 횟수 초기화
      // 3회 미만일 때는 시도 횟수를 유지하여 누적
      if (currentAttempt >= 3) {
        setCurrentAttempt(0);
      }
      return;
    }
    
    // 다음 문장으로 또는 챕터 완료
    handleNextSentence();
  };

  // 다음 문장으로 이동 또는 챕터 완료
  const handleNextSentence = () => {
    if (currentIndex < sentences.length - 1) {
      // 다음 문장으로
      setCurrentIndex(currentIndex + 1);
      setShowSynonyms(false);
      setCurrentAttempt(0);
      setShowFeedback(false);
      setLastFeedback(null);
    } else {
      // 챕터 완료 - 최종 피드백 화면으로
      showChapterFeedback();
    }
  };

  // 챕터 완료 피드백 표시
  const showChapterFeedback = () => {
    // 학습 통계 계산
    const completedCount = Object.keys(sentenceLearningStates).length;
    const passedSentences = Object.keys(sentenceLearningStates).filter(
      key => sentenceLearningStates[parseInt(key)].passed
    );
    const needsMorePractice = Object.keys(sentenceLearningStates).filter(
      key => sentenceLearningStates[parseInt(key)].needsMorePractice
    );
    
    // 연습이 더 필요한 문장들
    const practiceNeededSentences = needsMorePractice.map(key => ({
      text: sentences[parseInt(key)].korean,
      translation: sentences[parseInt(key)].english,
      mastery: sentenceLearningStates[parseInt(key)].score
    }));
    
    // 완벽하게 익힌 문장들
    const masteredSentences = passedSentences.map(key => ({
      text: sentences[parseInt(key)].korean,
      translation: sentences[parseInt(key)].english,
      mastery: sentenceLearningStates[parseInt(key)].score
    }));
    
    const completionRecord = {
      id: Date.now(),
      type: 'sentence',
      title: chapter?.title || '문장 학습',
      date: new Date().toISOString().split('T')[0],
      progress: (passedSentences.length / sentences.length) * 100,
      completedSentences: completedCount,
      totalSentences: sentences.length,
      masteredSentences,
      practicedSentences: practiceNeededSentences,
      chapter: chapter // 챕터 정보 추가 (다시 연습하기를 위해)
    };
    
    // 학�� 기록을 전달하고 피드백으로 이동
    if (onComplete) {
      onComplete(completionRecord);
    }
    onNavigate('feedback');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBackClick}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1>{chapter?.title || "문장 학습"}</h1>
            <p className="text-sm text-gray-600">{chapter?.description || "문장을 학습하세요"}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">진행률</span>
              <span className="text-sm">{currentIndex + 1} / {sentences.length}</span>
            </div>
            <Progress value={progress} />
          </CardContent>
        </Card>

        {/* Main Sentence Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>문장 {currentIndex + 1}</CardTitle>
              <Badge variant={isCompleted ? "default" : "secondary"}>
                {isCompleted ? <CheckCircle2 className="w-4 h-4 mr-1" /> : null}
                {isCompleted ? '완료' : '학습중'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Korean Sentence */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg">
              <p className="text-center text-2xl mb-4">
                {currentSentence.korean}
              </p>
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handlePlayPronunciation}
                  disabled={isRecording}
                >
                  <Volume2 className={`w-5 h-5 mr-2 ${isPlaying ? 'animate-pulse' : ''}`} />
                  {isPlaying ? '재생 중...' : '발음 듣기'}
                </Button>
              </div>
            </div>

            {/* English Translation */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">{currentSentence.english}</p>
            </div>

            {/* Practice Speaking */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isRecording 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-blue-500'
              }`}>
                <Mic className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 mb-2">
                {isRecording ? '녹음 중...' : '직접 말해보세요'}
              </p>
              {!isRecording && currentAttempt > 0 && (
                <p className="text-sm text-gray-500 mb-4">
                  시도: {currentAttempt} / 3
                </p>
              )}
              {!isRecording && currentAttempt < 3 && !showFeedback && (
                <Button onClick={handleStartRecording} size="lg">
                  <Mic className="w-4 h-4 mr-2" />
                  {currentAttempt === 0 ? '말하기 시작' : '다시 말하기'}
                </Button>
              )}
              {isRecording && (
                <p className="text-sm text-red-600">말씀하세요...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sentence Feedback */}
        {showFeedback && lastFeedback && (
          <Card className={lastFeedback.passed ? 'border-2 border-green-500' : 'border-2 border-orange-500'}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI 발음 평가</CardTitle>
                <div className="text-sm text-gray-600">
                  시도 {lastFeedback.attempt} / {lastFeedback.maxAttempts}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Score */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-3 ${
                  lastFeedback.passed 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                    : 'bg-gradient-to-br from-orange-500 to-red-500'
                } text-white`}>
                  <div>
                    <div className="text-3xl">{lastFeedback.score}</div>
                    <div className="text-xs">점</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  {lastFeedback.passed ? (
                    <Badge variant="default" className="bg-green-500 text-lg">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      통과!
                    </Badge>
                  ) : (
                    <Badge variant="default" className="bg-orange-500 text-lg">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {lastFeedback.attempt >= 3 ? '연습 필요' : '다시 시도'}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Correct Parts */}
              {lastFeedback.correctParts && lastFeedback.correctParts.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">잘한 부분</div>
                    <div className="flex flex-wrap gap-2">
                      {lastFeedback.correctParts.map((part: string, i: number) => (
                        <Badge key={i} variant="outline" className="bg-green-50">
                          {part}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Incorrect Parts */}
              {lastFeedback.incorrectParts && lastFeedback.incorrectParts.length > 0 && (
                <>
                  {lastFeedback.incorrectParts.map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="mb-1">
                          <Badge variant="outline" className="bg-orange-100">
                            {item.word}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{item.issue}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Improvements */}
              {lastFeedback.improvements && lastFeedback.improvements.length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm mb-2">💡 개선 방법</p>
                  <ul className="space-y-1">
                    {lastFeedback.improvements.map((improvement: string, i: number) => (
                      <li key={i} className="text-sm text-gray-700">• {improvement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                {/* 80점 미만이고 3회 미만 시도: 다시 연습하기만 표시 */}
                {!lastFeedback.passed && lastFeedback.attempt < 3 && (
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleSentenceFeedbackAction('retry')}
                  >
                    다시 연습하기
                  </Button>
                )}
                
                {/* 80점 이상이거나 3회 시도 완료 시: 다음 문장으로 버튼 표시 */}
                {(lastFeedback.passed || lastFeedback.attempt >= 3) && (
                  <>
                    {/* 3회 시도했지만 실패한 경우 다시 연습하기 버튼도 함께 표시 */}
                    {!lastFeedback.passed && lastFeedback.attempt >= 3 && (
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleSentenceFeedbackAction('retry')}
                      >
                        다시 연습하기
                      </Button>
                    )}
                    <Button 
                      className="flex-1"
                      onClick={() => handleSentenceFeedbackAction('next')}
                    >
                      {currentIndex < sentences.length - 1 ? '다음 문장으로' : '학습 완료'}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Synonyms Card */}
        {!showFeedback && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>비슷한 표현</CardTitle>
                  <CardDescription>같은 의미의 다른 말하기 방법</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowSynonyms(!showSynonyms)}
                >
                  {showSynonyms ? '숨기기' : '보기'}
                </Button>
              </div>
            </CardHeader>
            {showSynonyms && currentSentence.synonyms && (
              <CardContent className="space-y-3">
                {currentSentence.synonyms.map((synonym: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <div className="flex-1">
                      <p>{synonym}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        )}

        {/* Navigation - 피드백이 없을 때만 표시 */}
        {!showFeedback && (
          <div className="flex gap-3">
            {currentIndex > 0 && (
              <Button 
                variant="outline"
                onClick={() => {
                  setCurrentIndex(currentIndex - 1);
                  setShowSynonyms(false);
                  setCurrentAttempt(0);
                  setShowFeedback(false);
                  setLastFeedback(null);
                }}
              >
                이전 문장
              </Button>
            )}
            {sentenceLearningStates[currentIndex]?.passed && (
              <Button 
                className="flex-1"
                onClick={handleNextSentence}
              >
                {currentIndex < sentences.length - 1 ? '다음 문장' : '학습 완료'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
