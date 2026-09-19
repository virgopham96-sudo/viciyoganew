import { Course, Trainer, ActivitySpace, FAQItem, Lead, StudentFeedback } from '../types';

export const VICI_INFO = {
  name: 'VICI YOGA THERAPY TRAINING CENTER',
  shortName: 'VICI Yoga Therapy',
  slogan: 'Thấu hiểu cơ thể. Chuyển hóa từ bên trong.',
  subSlogan: 'Đồng hành cùng bạn trên hành trình luyện tập, thấu hiểu cơ thể và phục hồi tự nhiên một cách khoa học, bền vững.',
  hotline: '036 684 0130',
  secondaryHotline: '0924 87 6868',
  email: 'Henry.viciyogi@gmail.com',
  mainAddress: 'Căn hộ B1-0705, Chung cư Opal Boulevard, Đ. Phạm Văn Đồng, TP. Dĩ An / TP. Thủ Đức, TP. Hồ Chí Minh',
  shortAddress: 'Block B1, Opal Boulevard, Phạm Văn Đồng, TP. HCM',
  operatingHours: '06:00 - 20:30 (Thứ 2 - Thứ 7)',
  foundedYear: '2023',
  meaning: {
    nameOrigin: '"Vici" là viết tắt của "Vinh City" - nơi gắn liền với quê hương của Yogi Henry Phan (Hùng Phan).',
    logoSymbol: 'Logo hình tổ ong được lấy cảm hứng từ chữ K (trong tên Kiều Hùng, vợ của Henry Hùng Phan cũng là Master Yoga) xếp thành hình lục giác. Biểu trưng cho sự kiến tạo những giá trị thâm sâu, bền vững và khát vọng vươn tầm thế giới.',
    coreValue: 'Giá trị cốt lõi là "sự phụng sự" – mang đến Yoga đúng nghĩa, kiến tạo Yoga xanh và lan tỏa giá trị chữa lành cho cộng đồng, khối văn phòng và doanh nghiệp.'
  },
  vision: 'Trở thành trung tâm đào tạo Yoga Trị liệu và chăm sóc sức khỏe toàn diện (Wellness) chuẩn mực tại Việt Nam, kết nối với bản đồ Yoga quốc tế và lan tỏa phương pháp chữa lành tự nhiên đến mọi người.',
  mission: 'Phụng sự cộng đồng bằng phương pháp Yoga Trị liệu khoa học, hỗ trợ phục hồi hệ cơ xương khớp, xoa dịu thân tâm và đào tạo đội ngũ Huấn luyện viên Yoga Trị liệu có tâm, có tầm.',
  coreValues: [
    {
      title: 'Sự phụng sự',
      description: 'Đặt sức khỏe, sự thấu hiểu và chuyển hóa tự nhiên của học viên lên hàng đầu trong mọi lớp học.'
    },
    {
      title: 'Yoga đúng nghĩa & Khoa học',
      description: 'Kết hợp triết lý Yoga cổ truyền Ấn Độ với kiến thức Y học thể thao, giải phẫu học và vận động trị liệu hiện đại.'
    },
    {
      title: 'Kiến tạo Yoga Xanh & Chữa Lành',
      description: 'Xây dựng môi trường luyện tập hòa hợp thiên nhiên, nuôi dưỡng sự bình an và cân bằng từ bên trong.'
    },
    {
      title: 'Đổi mới & Đồng hành Công nghệ',
      description: 'Ứng dụng AI thông minh hỗ trợ tư vấn học viên, tối ưu quy trình chăm sóc và nâng tầm trải nghiệm luyện tập.'
    }
  ],
  socialLinks: {
    facebookCenter: 'https://www.facebook.com/share/1Jg9BYBj9e/',
    facebookHenry: 'https://www.facebook.com/share/1Ee5FJ3RdA/',
    facebookMyKieu: 'https://www.facebook.com/share/1D9e8r8cYV/',
    tiktokHenry: 'https://www.tiktok.com/@yogatherapywithhenry?_r=1&_t=ZS-987kgbGc29k',
    tiktokMyKieu: 'https://www.tiktok.com/@yogimykieu?_r=1&_t=ZS-987koltWEqq',
    tiktokCouple: 'https://www.tiktok.com/@vochongyogi?_r=1&_t=ZS-987kgISGKwv',
    instagramHenry: 'https://www.instagram.com/yogatherapywithhenry?igsh=MTFubHpvZzh6NW5jaw',
    instagramCenter: 'https://www.instagram.com/viciyogatherapy_welness?igsh=N3Z2a2I2ZHc0ZzNy'
  },
  medicalDisclaimer: 'Vici Yoga Therapy Training Center cung cấp các phương pháp rèn luyện thể chất, yoga trị liệu và phục hồi chức năng tự nhiên nhằm nâng cao sức khỏe và hỗ trợ cải thiện hệ cơ xương khớp. Các thông tin do AI Agent hoặc website cung cấp mang tính chất tham khảo giáo dục và không thay thế cho chẩn đoán, trị liệu hoặc tư vấn y khoa chuyên sâu từ bác sĩ chuyên khoa. Khách hàng có bệnh lý cấp tính hoặc chấn thương nặng được khuyến nghị tham vấn ý kiến bác sĩ trước khi bắt đầu lộ trình tập luyện.'
};

export const VICI_ASSETS = {
  logo: '/vici-logo.jpg',
  emblem: '/vici-emblem.png',
  logoSvg: '/logo.svg',
  henry: {
    primary: 'https://lh3.googleusercontent.com/pw/AP1GczOdVihLcgY1GwRwaWSFo125JXXMLYRzCMWtMr3CU_xnE5ukwOzaLniK2c0Sp4dcxWSuhVGqVZ40TasCUN2dMOQJQgjzsE8C_xIZHL-_Owliv6kPQoA=w1200',
    teaching: 'https://lh3.googleusercontent.com/pw/AP1GczOdVihLcgY1GwRwaWSFo125JXXMLYRzCMWtMr3CU_xnE5ukwOzaLniK2c0Sp4dcxWSuhVGqVZ40TasCUN2dMOQJQgjzsE8C_xIZHL-_Owliv6kPQoA=w1200',
    sourceUrl: 'https://photos.app.goo.gl/FiQcokp22R3w9Jod8'
  },
  myKieu: {
    primary: 'https://lh3.googleusercontent.com/pw/AP1GczPAUVfTa0oXQxdNTalEQAJn1CkvwcwsjgcUqp2yjHZxUYqID-TxcroxhDRC-LKCEaKAn-yvwlh3VNRwEcGxvjSvSCOfG1ZkQVAIgUa5SQx2Xi7v0ng=w1200',
    sourceUrl: 'https://photos.app.goo.gl/ZpxfiZ9YHGTAF9yg6'
  },
  linhAnna: {
    primary: 'https://lh3.googleusercontent.com/pw/AP1GczMMQ0sVyq-55a5lFvxhDZwz2LSkkyLOIzgQxbnWg7LYTakiwK-Y0CbcEi6Q9idHjI5TBjEc8dsM1ZiMZRIBAayQxvMN0sG6yFtvJKimixxAzPBETtA=w1200',
    sourceUrl: 'https://photos.app.goo.gl/HZLhgJoKLGmKF5he8'
  },
  therapy: {
    primary: 'https://lh3.googleusercontent.com/pw/AP1GczPF4emCov29YGVGtIxdC_XZQIhI5WNo0GfhiipdyOmhuMtaZzCBxF5weHKrObymd8fB8v8_mtAFLN4hr5VTkj-La_JLWMpTNcF2BqRZ_fqXEElWw4I=w1200',
    sourceUrl: 'https://photos.app.goo.gl/1b1CLPGQLsej8XLn9'
  },
  advanced: {
    primary: 'https://lh3.googleusercontent.com/pw/AP1GczOI-8i71VholrsA4EO4lMIs22l-0aNk0ddlYbLiOi1Gh1GPU_cMYLQEZYQq-_dsV0m504ZdCHr6eB23uS0EJz4HwyLXiThp3HPpI4sem3OhnKGGGHo=w1200',
    sourceUrl: 'https://photos.app.goo.gl/imtVzAtXVtGqWveXA'
  },
  trainer: {
    primary: 'https://lh3.googleusercontent.com/pw/AP1GczMGv_1XCVD8uYAG7y6nE33M2JzdeE9TrGkkzN422cPxlO1hSaK4EfW2AOaFsT65lcf_votg-hR04uO4cvm2V7z2pV8wJz2_iI3fnEW24V-YnGKHuDk=w1200',
    sourceUrl: 'https://photos.app.goo.gl/tGQM7426ihCjLn6p9'
  },
  workshop: {
    primary: 'https://lh3.googleusercontent.com/pw/AP1GczPDp9ZGkq0ibYRCkdPRVw2drDs0aNCzMD16MC98MhX77lSuXyb0xE_hJyo4kqbdiex3G3acgU17Zyr0oZ86sdzyJ74DSSR49IagTWbEp_PJE19vS-s=w1200',
    sourceUrl: 'https://photos.app.goo.gl/pSDNhMTZxrqWAkj69'
  },
  chanMay: {
    primary: '/images/spaces/yoga-chan-may.jpg',
    remoteUrl: 'https://lh3.googleusercontent.com/pw/AP1GczOQrZLqCHLZiIUZoHrdsUIUyCvQx31YqmzNbChyQJ_GzPajiMuFID5YhmfiU6l47ew98Dv2_vVNLWmgGmGzsiXm2xomIUI9YBObDJAbxVDzlJBmsNg=w1200',
    sourceUrl: 'https://photos.app.goo.gl/9ebziKjNcHf4oFFY9'
  },
  daChieu: {
    primary: 'https://lh3.googleusercontent.com/pw/AP1GczNAo8vwW1VYdp4WJ4MGr3_SQQj_8RnrPSL3Rsx_jsQCodAq-DgaiyegvLQSKMXy0Y052EOyJcGsv9nYctVwpzSDpUnD9xqtdZfZ5UJu7H7Nwcul_Hk=w1200',
    sourceUrl: 'https://photos.app.goo.gl/Lj5Kc8FAwXWw5rpc7'
  },
  vuonOng: {
    primary: 'https://lh3.googleusercontent.com/pw/AP1GczPQHdPcdjJYR088jFCRFqLQ2MFG4h9H_a0yqs-bTPK4xEJVhYKHCYhmdECvQaJ9bokNjt0n3JrMGDsuHY4zVqVx-fxHNiNAk4CZkOaWJskN3IajssQ=w1200',
    sourceUrl: 'https://photos.app.goo.gl/M6ifu2vVqGTMBEyMA'
  },
  schedule: {
    primary: 'https://lh3.googleusercontent.com/pw/AP1GczP8w5V9adS46uK0uArYOBmDZCkGqJFJthbI1gJzQZqrUuMMaVdaG6PT0RuRt5F3HdCHznLm-BjfoyuGQf3thsTlKMQ7tbPytyRT58E3NgHXUWczGOY=w1600',
    sourceUrl: 'https://photos.app.goo.gl/A7SWRW4ps93fg1qx6'
  },
  package3Months: {
    primary: '/images/courses/package-3-months.jpg',
    remoteUrl: 'https://lh3.googleusercontent.com/pw/AP1GczP67JTsvcELf6DRQkVB8eaAIV9LHeQ0JU2uWXaz8AmUTz14r_GJ4O9l-HOvhAAcrZYDjhFW3YlbwE9ZqOABZ7lByuvp6Z7qHEJbBeTD8iYprKTL55g=w1200',
    sourceUrl: 'https://photos.app.goo.gl/sLPE6uewqsEQddAy5'
  },
  package6Months: {
    primary: '/images/courses/package-6-months.jpg',
    remoteUrl: 'https://lh3.googleusercontent.com/pw/AP1GczML7jrwRqUGbVTAovP4PkVd05utfsIeCPlXC6xWAEWJuTFFI1VSbuep8dQtQvemOCDI--2oJXycKFmlHilw67ZXI3bLl06ln_X70pq1zv1UjcIZZQU=w1200',
    sourceUrl: 'https://photos.app.goo.gl/bUZLuNpmUDReiWzf7'
  },
  package1Year: {
    primary: '/images/courses/package-1-year.jpg',
    remoteUrl: 'https://lh3.googleusercontent.com/pw/AP1GczOoim7HogolgKvmDXv_4YMp1O7yZQbAfL6M7yY1l1z5Z68OBbEj6nR0SKSsOKkqO9y6jo_faBSN9-I2TfXU3kPVzgpOGWNxVtVUNr7U063h53by0Fw=w1200',
    sourceUrl: 'https://photos.app.goo.gl/vrMWCMP9HjHZ8SJcA'
  },
  therapyIntensive: {
    primary: '/images/courses/therapy-intensive-1on1.jpg',
    remoteUrl: 'https://lh3.googleusercontent.com/pw/AP1GczPiO0Gst3Q2OISQKPj6b6S0iqNmq8837kuErN8jX71qk3PqMft1jpE97GwDzRhvRdTfn8rkuktf0hdD-ZhQ-OufvmDkkWvLftS_gVffFeqW7UFpn7I=w1200',
    sourceUrl: 'https://photos.app.goo.gl/66G2TT87Ca7nSg4FA'
  },
  ayurveda: {
    primary: '/images/courses/yoga-english-ayurveda.jpg',
    remoteUrl: 'https://lh3.googleusercontent.com/pw/AP1GczOaVprahik3HkUPqThSKUIJ3O1Zf0LGH6k32cVmlV0yaAbBzkRU4cBfZzJq-Jt--T30FQ1a9VKfPcCSrxXG_cvqTryIf6TxXR5REp0OiNXd9mnyfzE=w1200',
    sourceUrl: 'https://photos.app.goo.gl/SkbVM4BTZC9sUZMk7'
  }
};

export const VICI_STATS = [
  {
    value: '52+',
    label: 'Ca trị liệu & phục hồi thành công',
    subLabel: 'Hệ cơ xương khớp, cột sống & chấn thương',
    verified: true
  },
  {
    value: '500+',
    label: 'Học viên đồng hành',
    subLabel: 'Luyện tập thường xuyên & trải nghiệm',
    verified: true
  },
  {
    value: '35+',
    label: 'HLV Yoga Trị liệu đã đào tạo',
    subLabel: 'Tốt nghiệp khóa đào tạo HLV chuyên nghiệp',
    verified: true
  },
  {
    value: '45+',
    label: 'Doanh nghiệp & Đối tác',
    subLabel: 'Chuỗi workshop văn phòng & Corporate Wellness',
    verified: true
  }
];

export const THERAPY_SOP_STEPS = [
  {
    step: '01',
    name: 'Tầm soát & Đánh giá',
    subTitle: 'Body Scan & Assessment (45-60 phút)',
    description: 'Kiểm tra góc lệch tư thế, đo biên độ vận động cơ khớp, tầm soát chính xác điểm đau co thắt và ghi nhận kỹ lưỡng tiền sử y khoa/thói quen sinh hoạt.',
    benefit: 'Xác định chính xác căn nguyên gây đau mỏi cơ xương khớp thay vì chỉ xoa dịu triệu chứng bề mặt.'
  },
  {
    step: '02',
    name: 'Lập Phác Đồ Trị Liệu Cá Nhân Hóa',
    subTitle: 'Personalized Treatment Protocol',
    description: 'Thiết lập mục tiêu rõ ràng và lộ trình đo lường theo từng giai đoạn (ví dụ: giảm 70% đau mỏi vai gáy sau 5 buổi, cân bằng lệch hông sau 10 buổi).',
    benefit: 'Không áp dụng bài tập đại trà, mỗi cơ thể là một phác đồ độc bản.'
  },
  {
    step: '03',
    name: 'Tập Luyện & Điều Chỉnh Trực Tiếp',
    subTitle: 'Hands-on Alignment & Therapy',
    description: 'Thực hành các bài tập giải phóng điểm co thắt, kích hoạt các nhóm cơ yếu, kết hợp kỹ thuật thở định tâm Pranayama và tác động định tuyến thủ công.',
    benefit: 'Đảm bảo sự an toàn tuyệt đối, học viên cảm nhận sự nhẹ nhõm ngay trong buổi tập.'
  },
  {
    step: '04',
    name: 'Tái Khám Định Kỳ & Bài Tập Tại Nhà',
    subTitle: 'Re-assessment & Home Maintenance',
    description: 'Đo đạc lại các chỉ số biên độ cơ khớp định kỳ sau mỗi 5 - 10 buổi. Bàn giao video bài tập và hướng dẫn tự chăm sóc tại văn phòng/tại nhà.',
    benefit: 'Duy trì kết quả phục hồi bền vững, ngăn ngừa tái phát cơn đau khi làm việc.'
  }
];

export const VICI_TRAINERS: Trainer[] = [
  {
    id: 'henry-phan',
    name: 'Master Henry Phan',
    realName: 'Phan Văn Hùng (Yogi Hùng Phan)',
    title: 'Founder & Giảng viên Trưởng VICI Yoga Therapy',
    role: 'Chuyên gia Yoga Trị liệu & International Master Yoga',
    quote: '“Yoga giúp tôi tìm thấy sự bình yên giữa dòng chảy cuộc sống. Ashtanga cho tôi tạo ra dòng chảy giữa sự bình yên.”',
    specialties: [
      'Yoga Trị liệu cột sống & cơ xương khớp',
      'Ashtanga Yoga Mysore & Căn chỉnh trục 6D',
      'Đào tạo Huấn luyện viên Yoga quốc tế',
      'Trị liệu chuông xoay & thiền Nepal/Rishikesh'
    ],
    credentials: [
      'Master Yoga E-RYT 500 từ Yoga Alliance (Hoa Kỳ) - cấp từ tháng 05/2020',
      'YACEP (Yoga Alliance Continuing Education Provider) - Nhà cung cấp đào tạo liên tục',
      'International Master Yoga tại Rishikesh, Ấn Độ (Chứng nhận RYT Alliance USA 2022)',
      'Tốt nghiệp chương trình Giảng viên Yoga quốc tế từ Đại học Yoga tại Ấn Độ',
      'Cử nhân Đại học Kinh tế Quốc dân (Hà Nội)',
      'Chứng chỉ Trị liệu Yoga Châu Á Thái Bình Dương (APYTA 6th 2022)',
      'Á Quân Got Talent FLG Việt Nam 2022',
      'Hơn 7-8 năm kinh nghiệm giảng dạy chuyên sâu tại Việt Nam và quốc tế'
    ],
    experience: 'Hơn 7-8 năm kinh nghiệm',
    teachingLocations: [
      'Bệnh viện Đa khoa Tâm Anh (Tam Anh Hospital) - Chuyên gia Trị liệu cột sống cho hàng trăm cán bộ nhân viên y tế (07/2023 - Hiện tại)',
      'Vinpearl Landmark Sky Studio Yoga - Giảng viên (10/2024 - Hiện tại)',
      'Vici Yoga Therapy Training Center - Founder & Giảng viên (03/2023 - Hiện tại)',
      'Jetts Fitness Australia - Giảng viên Yoga (01/2022 - Hiện tại)',
      'California Fitness & Yoga - Giảng viên Yoga (10/2019 - Hiện tại)'
    ],
    bio: 'Master Henry Phan là một trong những chuyên gia Yoga Trị liệu uy tín hàng đầu tại Việt Nam. Điểm đắt giá nhất ở thầy là kinh nghiệm đào tạo trực tiếp về trị liệu cột sống cho đội ngũ y bác sĩ, nhân viên y tế tại Bệnh viện Đa khoa Tâm Anh và tập đoàn Vinpearl. Thầy từng tu nghiệp tại cái nôi Yoga Rishikesh và trường phái Ashtanga Mysore (Ấn Độ), tiên phong ứng dụng 6D Yoga vào đào tạo Master và trị liệu chuẩn khoa học.',
    photoUrl: VICI_ASSETS.henry.primary,
    sourcePhotoUrl: VICI_ASSETS.henry.sourceUrl,
    socials: {
      facebook: VICI_INFO.socialLinks.facebookHenry,
      tiktok: VICI_INFO.socialLinks.tiktokHenry,
      instagram: VICI_INFO.socialLinks.instagramHenry
    }
  },
  {
    id: 'my-kieu',
    name: 'Master Mỹ Kiều',
    title: 'Co-Founder VICI Yoga Therapy',
    role: 'Chuyên gia Yoga Phục hồi & Liệu pháp Chuông Xoay',
    quote: '“TÂM AN - VẠN SỰ AN. Hãy để từng hơi thở dẫn dắt cơ thể bạn về với trạng thái chữa lành thuần khiết nhất.”',
    specialties: [
      'Yoga Phục hồi & Trị liệu Thân - Tâm',
      'Liệu pháp Chuông xoay & Thiền định',
      'Yoga cho Phụ nữ & Chăm sóc giấc ngủ',
      'Cộng đồng Healing & Wellness 2026'
    ],
    credentials: [
      'Master Yoga đồng hành cùng VICI Yoga Therapy từ những ngày đầu',
      'Chuyên gia điều phối chuỗi Workshop Mindfulness và Trị liệu Chuông Xoay',
      'Kinh nghiệm tu học liệu pháp âm thanh và thiền phong cách Nepal - Rishikesh',
      'Đồng sáng lập Cộng đồng Healing & Wellness 2026 tại TP. Hồ Chí Minh'
    ],
    experience: 'Nhiều năm chuyên sâu Yoga phục hồi',
    teachingLocations: [
      'VICI Yoga Therapy Studio (Opal Boulevard)',
      'Không gian Yoga Chân Mây (Vinpearl Autograph Collection)',
      'Vườn Ong Xóm Lá (Thủ Đức)'
    ],
    bio: 'Master Mỹ Kiều là người truyền cảm hứng mạnh mẽ về lối sống tỉnh thức và sự bình an nội tâm. Chị chuyên sâu về các lớp Yoga phục hồi, giải tỏa áp lực thần kinh, cải thiện chứng mất ngủ và trị liệu âm thanh bằng chuông xoay Tây Tạng. Sự mềm mại, lắng nghe và thấu hiểu của chị mang lại không gian an trú ấm áp cho mỗi học viên.',
    photoUrl: VICI_ASSETS.myKieu.primary,
    sourcePhotoUrl: VICI_ASSETS.myKieu.sourceUrl,
    socials: {
      facebook: VICI_INFO.socialLinks.facebookMyKieu,
      tiktok: VICI_INFO.socialLinks.tiktokMyKieu
    }
  },
  {
    id: 'linh-anna',
    name: 'HLV Linh Anna',
    title: 'Giảng viên Yoga Trị liệu VICI',
    role: 'Huấn luyện viên Trị liệu & Định tuyến Cơ thể',
    quote: '“Tập luyện đúng cách bắt đầu từ việc lắng nghe tiếng nói của từng khớp xương và hơi thở.”',
    specialties: [
      'Định tuyến cơ thể và căn chỉnh tư thế',
      'Yoga Kéo giãn (Stretching) & Mở khớp hông - vai',
      'Hatha Yoga nền tảng cho người mới'
    ],
    credentials: [
      'Chứng chỉ Huấn luyện viên Yoga Trị liệu chuyên nghiệp do VICI cấp',
      'Kinh nghiệm hướng dẫn lớp nhóm và hỗ trợ các ca Scan cơ vai cổ gáy',
      'Đồng hành cùng học viên trong lộ trình phục hồi hệ cơ xương khớp'
    ],
    experience: 'Đào tạo chuẩn VICI Yoga Therapy',
    teachingLocations: [
      'VICI Yoga Therapy Center (Opal Boulevard)',
      'Các lớp cộng đồng Online & Offline'
    ],
    bio: 'HLV Linh Anna là giảng viên tận tâm, kiên nhẫn trong từng bài tập căn chỉnh tư thế cho học viên. Cô nổi bật với phong cách hướng dẫn tỉ mỉ, giúp người mới bắt đầu hoặc người có đau nhức cơ thể cảm thấy an tâm, không bị áp lực ép dẻo quá mức.',
    photoUrl: VICI_ASSETS.linhAnna.primary,
    sourcePhotoUrl: VICI_ASSETS.linhAnna.sourceUrl
  }
];

export const VICI_COURSES: Course[] = [
  {
    id: 'package-3-months',
    name: 'Gói Yoga Cá Nhân Hóa 3 Tháng',
    category: 'package',
    badge: 'Phổ biến cho người mới',
    shortDesc: 'Tham gia lớp nhóm cá nhân hoá hàng tuần, chỉnh sửa kỹ từng học viên, xây dựng nền tảng vững vàng.',
    fullDesc: 'Gói tập 3 tháng được thiết kế linh hoạt cho người mới bắt đầu hoặc người muốn thiết lập thói quen vận động đúng cách. Học viên được tham gia các lớp tập theo thời khóa biểu (Yoga for Newbie, Hatha, Stretching, Hip Opening, Shoulder & Upperback), được giảng viên chỉnh sửa kỹ thuật cẩn thận.',
    targetAudience: [
      'Người mới bắt đầu tập Yoga cần hướng dẫn căn bản',
      'Nhân viên văn phòng đau mỏi cổ vai gáy nhẹ do ngồi nhiều',
      'Người muốn rèn luyện tính dẻo dai và giải tỏa căng thẳng'
    ],
    duration: '3 tháng (12 tuần)',
    schedule: 'Các khung giờ linh hoạt trong Thời khóa biểu (T2 - T6)',
    format: 'Trực tiếp tại Studio',
    priceDisplay: '2.550.000 VNĐ',
    priceDetail: 'Tương đương 850.000 VNĐ/tháng. Đã xác nhận chính thức.',
    priceStatus: 'CONFIRMED',
    benefits: [
      'Miễn phí 01 buổi Tầm soát tư thế ban đầu (Body Scan)',
      'Chỉnh sửa kỹ từng tư thế, không sợ ép cơ sai trục',
      'Tùy chọn mua thêm Scan Trị liệu cơ vai cổ gáy với giá 650.000đ/buổi',
      'Tùy chọn mua thêm Workshop Mindfulness với giá 1.200.000đ/buổi',
      'Được bảo lưu tối đa 03 tháng khi có lý do sức khỏe/công tác'
    ],
    outcomes: [
      'Cải thiện tư thế ngồi làm việc, giảm cảm giác căng cứng cơ thể',
      'Nắm vững kỹ thuật thở định tâm Pranayama và nguyên tắc an toàn',
      'Tăng độ linh hoạt các khớp và sự dẻo dai toàn thân'
    ],
    photoUrl: VICI_ASSETS.package3Months.primary,
    sourcePhotoUrl: VICI_ASSETS.package3Months.sourceUrl
  },
  {
    id: 'package-6-months',
    name: 'Gói Yoga Cá Nhân Hóa 6 Tháng',
    category: 'package',
    badge: 'Tối ưu chi phí & chuyển hóa',
    shortDesc: 'Liệu trình 6 tháng kiên trì chuyển hóa cơ thể, hỗ trợ giải phóng cơn đau và nâng cao thể lực.',
    fullDesc: 'Gói 6 tháng mang đến thời gian lý tưởng để cơ thể tái cấu trúc hệ cơ xương khớp, cân bằng cột sống và hình thành lối sống tĩnh thức. Tiết kiệm hơn với mức phí chỉ 800.000đ/tháng.',
    targetAudience: [
      'Người có tình trạng đau mỏi vai gáy hoặc cột sống tái đi tái lại',
      'Người đã có kinh nghiệm muốn thực hành sâu hơn với Vinyasa, Yin Yoga, Dynamic',
      'Người cần cải thiện chất lượng giấc ngủ và vóc dáng'
    ],
    duration: '6 tháng (24 tuần)',
    schedule: 'Tự do chọn lớp theo Thời khóa biểu tuần (Sáng - Chiều - Tối)',
    format: 'Trực tiếp tại Studio',
    priceDisplay: '4.800.000 VNĐ',
    priceDetail: 'Tương đương 800.000 VNĐ/tháng. Đã xác nhận chính thức.',
    priceStatus: 'CONFIRMED',
    benefits: [
      'Miễn phí 01 buổi Tầm soát tư thế ban đầu (Body Scan)',
      'Tiết kiệm 300.000đ so với gia hạn từng chu kỳ 3 tháng',
      'Tùy chọn mua thêm Scan Trị liệu cơ vai cổ gáy với giá 650.000đ/buổi',
      'Tùy chọn tham gia Workshop Chuông Xoay với giá 1.200.000đ/workshop',
      'Được bảo lưu tối đa 03 tháng khi có lý do đột xuất'
    ],
    outcomes: [
      'Phục hồi sự linh hoạt tự nhiên của cột sống và khớp hông',
      'Giải tỏa triệt để tình trạng mỏi cơ bả vai, cổ gáy do áp lực công việc',
      'Tăng sức mạnh nhóm cơ lõi (core) và nâng cao sức đề kháng'
    ],
    featured: true,
    photoUrl: VICI_ASSETS.package6Months.primary,
    sourcePhotoUrl: VICI_ASSETS.package6Months.sourceUrl
  },
  {
    id: 'package-1-year',
    name: 'Gói Đặc Biệt 1 Năm (All-in-One VIP)',
    category: 'package',
    badge: 'Đặc quyền trị liệu chuyên sâu',
    shortDesc: 'Gói cam kết dài hạn trọn vẹn 1 năm kèm quyền lợi Trị liệu Chuyên sâu và Workshop Mindfulness.',
    fullDesc: 'Gói thành viên đặc biệt trọn gói 1 năm giúp học viên duy trì lối sống Yoga và chăm sóc sức khỏe toàn diện với chi phí bình quân tháng tốt nhất (chỉ ~666.667đ/tháng). Tích hợp các buổi trị liệu chuyên sâu 1-1 và workshop cao cấp.',
    targetAudience: [
      'Học viên cam kết lâu dài với sức khỏe thân tâm',
      'Khách hàng cần theo dõi và phục hồi cột sống liên tục trong năm',
      'Chủ doanh nghiệp, quản lý cấp cao muốn không gian tĩnh tâm riêng tư'
    ],
    duration: '1 năm (12 tháng)',
    schedule: 'Không giới hạn các lớp trong Thời khóa biểu tuần',
    format: 'Trực tiếp tại Studio',
    priceDisplay: '8.000.000 VNĐ / Năm',
    priceDetail: 'Đơn giá bình quân chỉ ~666.667 VNĐ/tháng. Đã xác nhận chính thức.',
    priceStatus: 'CONFIRMED',
    benefits: [
      'Toàn quyền tham gia các lớp nhóm trong tuần theo TKB',
      'Tặng kèm 01 buổi Trị liệu Chuyên sâu 1-1 (trị giá 1.200.000đ)',
      'Tặng kèm 01 buổi Workshop Mindfulness / Chuông Xoay (trị giá 1.200.000đ)',
      'Ưu tiên đặt lịch khung giờ vàng với các Master',
      'Chính sách bảo lưu linh hoạt tới 03 tháng'
    ],
    outcomes: [
      'Chuyển hóa toàn diện thể chất, hơi thở và tinh thần sau 12 tháng',
      'Hệ cơ xương khớp vững chắc, duy trì trục cột sống khỏe mạnh',
      'Sở hữu kỹ năng tự thực hành và điều chỉnh cơ thể trọn đời'
    ],
    photoUrl: VICI_ASSETS.package1Year.primary,
    sourcePhotoUrl: VICI_ASSETS.package1Year.sourceUrl
  },
  {
    id: 'therapy-scan',
    name: 'Scan & Trị Liệu Cơ - Vai - Cổ - Gáy',
    category: 'therapy',
    badge: 'Dịch vụ Đánh giá Đầu vào',
    shortDesc: 'Buổi đánh giá chuyên sâu 45 - 60 phút theo SOP 4 bước, tầm soát điểm đau và phục hồi trực tiếp.',
    fullDesc: 'Dành cho khách hàng có pain point rõ rệt về đau mỏi vai gáy, tê tay, nhức mỏi lưng trên. Giảng viên trực tiếp đo đạc góc lệch tư thế, giải phóng các điểm Trigger Points cơ co thắt và tư vấn bài tập phù hợp.',
    targetAudience: [
      'Dân văn phòng bị mỏi cổ, bó cứng bả vai, thoái hóa nhẹ',
      'Người bị tê bì cánh tay hoặc đau nửa đầu do co rút cơ cổ',
      'Học viên trước khi tham gia các lớp tập để có lộ trình chính xác'
    ],
    duration: '45 - 60 phút / buổi',
    schedule: 'Đặt lịch hẹn trước theo yêu cầu (Khung giờ trống 06:00 - 20:00)',
    format: 'Theo lịch hẹn 1:1',
    priceDisplay: '650.000 VNĐ / buổi',
    priceDetail: 'Miễn phí tầm soát ban đầu khi đăng ký gói 3 hoặc 6 tháng.',
    priceStatus: 'CONFIRMED',
    benefits: [
      'Đo lường góc lệch cột sống cổ và biên độ xoay đầu',
      'Xác định các bó cơ đang bị quá tải hoặc teo yếu',
      'Tác động thủ công giải tỏa ngay cơn căng tức cổ vai gáy',
      'Nhận phác đồ bài tập cá nhân hóa để tự duy trì'
    ],
    outcomes: [
      'Giảm áp lực và độ co cứng vùng cổ vai ngay sau buổi thực hiện',
      'Hiểu rõ tư thế ngồi sai của bản thân để điều chỉnh hàng ngày',
      'Được chỉ định chính xác lớp học phù hợp để không bị chấn thương'
    ],
    photoUrl: VICI_ASSETS.therapy.primary,
    sourcePhotoUrl: VICI_ASSETS.therapy.sourceUrl
  },
  {
    id: 'therapy-intensive-1on1',
    name: 'Trị Liệu Chuyên Sâu 1-1 Cá Nhân Hóa',
    category: 'therapy',
    badge: 'Chuyên sâu & Riêng tư',
    shortDesc: 'Buổi trị liệu 1-1 chuyên biệt 60 - 75 phút cùng Master Henry Phan / chuyên gia trị liệu cao cấp.',
    fullDesc: 'Liệu trình phục hồi chuyên biệt giải quyết các vấn đề tổn thương cột sống, lệch khớp chậu, đau thần kinh tọa dạng nhẹ hoặc phục hồi vận động sau chấn thương. Không gian hoàn toàn riêng tư, yên tĩnh, microphone net chuẩn trị liệu.',
    targetAudience: [
      'Người có vấn đề cột sống, lệch hông, đau thắt lưng kéo dài',
      'Học viên cần theo dõi sát từng milimet cử động',
      'Doanh nhân, khách hàng có nhu cầu bảo mật và riêng tư cao'
    ],
    duration: '60 - 75 phút / buổi',
    schedule: 'Đặt lịch riêng biệt với Master',
    format: 'Theo lịch hẹn 1:1',
    priceDisplay: '1.200.000 VNĐ / buổi',
    priceDetail: 'Giá niêm yết chính thức trong tài liệu VICI.',
    priceStatus: 'CONFIRMED',
    benefits: [
      '1 kèm 1 trực tiếp cùng Master hàng đầu',
      'Ứng dụng phương pháp Vận động trị liệu y học thể thao kết hợp Yoga Ayurveda',
      'Sử dụng dụng cụ hỗ trợ chuẩn quốc tế (dây đai, block, chuông xoay)',
      'Phác đồ theo dõi liên tục qua từng buổi'
    ],
    outcomes: [
      'Giải tỏa các chèn ép lên rễ thần kinh, khôi phục trục đối xứng cơ thể',
      'Kích hoạt hệ thần kinh phó giao cảm, ngủ sâu giấc và thư thái',
      'Tái tạo năng lượng thân tâm một cách bền vững'
    ],
    photoUrl: VICI_ASSETS.therapyIntensive.primary,
    sourcePhotoUrl: VICI_ASSETS.therapyIntensive.sourceUrl
  },
  {
    id: 'workshop-singing-bowl',
    name: 'Workshop Liệu Pháp Chuông Xoay & Chánh Niệm',
    category: 'workshop',
    badge: 'Trải nghiệm Thư giãn Sâu',
    shortDesc: 'Liệu pháp âm thanh chuông xoay kết hợp thiền định phong cách Nepal – Rishikesh xua tan căng thẳng.',
    fullDesc: 'Workshop được tổ chức định kỳ vào Thứ 7 tuần thứ 2 và tuần thứ 4 của tháng. Tận dụng sóng âm và độ rung của chuông xoay Tây Tạng để đưa não bộ về trạng thái sóng Theta, giải tỏa stress, làm dịu tâm trí và thanh lọc năng lượng tiêu cực.',
    targetAudience: [
      'Người bị áp lực công việc nặng, mất ngủ mãn tính, kiệt sức (burnout)',
      'Người muốn tìm hiểu sâu về liệu pháp âm thanh và thiền định',
      'Cặp đôi hoặc nhóm bạn muốn có một buổi sáng cuối tuần tĩnh lặng'
    ],
    duration: '1 buổi (90 - 120 phút)',
    schedule: 'Thứ 7 tuần thứ 2 & tuần thứ 4 hàng tháng',
    format: 'Trực tiếp tại Studio',
    priceDisplay: '1.200.000 VNĐ / workshop',
    priceDetail: 'Đã xác nhận trong tài liệu giá VICI.',
    priceStatus: 'CONFIRMED',
    benefits: [
      'Trải nghiệm tắm âm thanh Sound Bath với chuông xoay thủ công Nepal',
      'Hướng dẫn kỹ thuật thở xoa dịu hệ thần kinh',
      'Thưởng thức trà thảo mộc tĩnh thức tại Vườn Trị Liệu',
      'Tặng quà lưu niệm và tài liệu thực hành tại nhà'
    ],
    outcomes: [
      'Cơ thể được buông lỏng tối đa, giảm ngay các âu lo dồn ứ',
      'Cải thiện chất lượng giấc ngủ ngay trong đêm diễn ra workshop',
      'Kết nối lại với sự bình yên sâu kín trong tâm hồn'
    ],
    photoUrl: VICI_ASSETS.workshop.primary,
    sourcePhotoUrl: VICI_ASSETS.workshop.sourceUrl
  },
  {
    id: 'course-advanced-ashtanga',
    name: 'Yoga Nâng Cao Ashtanga & Năng Lượng Cột Sống',
    category: 'training',
    badge: '10 Chuyên đề Chuyên sâu',
    shortDesc: 'Khóa nâng cao 10 buổi x 90 phút do chính Master Henry Phan trực tiếp hướng dẫn và căn chỉnh trục.',
    fullDesc: 'Khóa học tuyển sinh liên tục dành cho học viên muốn vượt qua các giới hạn cơ thể an toàn. Bao gồm 10 chuyên đề then chốt: Mở hông (chuỗi xoạc), Kỹ thuật lưng trên & vai, Vặn xoắn cột sống, Chuỗi Flow tăng thể lực, Nghiêng lườn, Chuỗi bồ câu, Chuối cẳng tay & chuối đầu (Headstand/Pincha), Uốn lưng hoàn chỉnh, Handstand.',
    targetAudience: [
      'Học viên đã có nền tảng Yoga từ 6 tháng trở lên',
      'Người muốn chinh phục các asana nâng cao (uốn lưng, đảo ngược, thăng bằng)',
      'Huấn luyện viên Yoga muốn trau dồi kỹ thuật căn chỉnh an toàn'
    ],
    duration: '10 buổi (90 phút/buổi)',
    schedule: 'Thứ 3 & Thứ 5: 14:00 – 15:30',
    format: 'Trực tiếp tại Studio',
    priceDisplay: '1.290.000 VNĐ',
    priceDetail: 'Ưu đãi đăng ký sớm (Early Bird). Giá niêm yết: 1.590.000 VNĐ / 10 buổi.',
    priceStatus: 'CONFIRMED',
    benefits: [
      'Master Henry trực tiếp hướng dẫn và nắn chỉnh cơ học tỉ mỉ',
      '10 chuyên đề bài bản từ mở khớp đến tư thế thăng bằng tay',
      'Cam kết luyện tập an toàn, bảo vệ đĩa đệm và cột sống',
      'Địa điểm tại Opal Boulevard, Phạm Văn Đồng, TP. Thủ Đức'
    ],
    outcomes: [
      'Thành thạo kỹ thuật định tuyến cơ thể, mở khớp hông và lưng trên an toàn',
      'Làm chủ tư thế đảo ngược (đầu, cẳng tay) và handstand mà không sợ chấn thương',
      'Khơi thông dòng năng lượng mạnh mẽ và sự vững chãi nội tâm'
    ],
    syllabus: [
      'Chuyên đề 1: Mở hông (chuỗi xoạc)',
      'Chuyên đề 2: Kỹ thuật linh hoạt lưng trên và vai',
      'Chuyên đề 3: Vặn xoắn cột sống',
      'Chuyên đề 4: Chuỗi Flow tăng thể lực',
      'Chuyên đề 5: Nghiêng lườn – kéo giãn thân bên',
      'Chuyên đề 6: Chuỗi bồ câu (uốn lưng một chân)',
      'Chuyên đề 7: Đứng bằng khuỷu tay & đứng bằng đầu (chuối cẳng tay – chuối đầu)',
      'Chuyên đề 8: Vặn xoắn & kéo giãn vai',
      'Chuyên đề 9: Uốn lưng hoàn chỉnh (lưng trên – lưng giữa – thắt lưng)',
      'Chuyên đề 10: Handstand - Làm khỏe cánh tay và cơ lõi'
    ],
    featured: true,
    photoUrl: VICI_ASSETS.advanced.primary,
    sourcePhotoUrl: VICI_ASSETS.advanced.sourceUrl
  },
  {
    id: 'course-hlv-international',
    name: 'Đào Tạo Huấn Luyện Viên Yoga Quốc Tế (YACEP & E-RYT 500)',
    category: 'training',
    badge: 'Chuẩn Yoga Alliance Hoa Kỳ',
    shortDesc: 'Chương trình đào tạo HLV chuyên nghiệp theo tiêu chuẩn quốc tế, trang bị trọn bộ kiến thức trị liệu.',
    fullDesc: 'Khóa đào tạo chuyên sâu cấp chứng chỉ quốc tế và chứng nhận VICI Yoga Therapy. Học viên được học trực tiếp cùng Master Henry Phan (E-RYT 500, tu nghiệp tại Đại học Yoga Ấn Độ và Rishikesh). Khóa học giúp chuyển đổi từ người đam mê thành giảng viên tự tin đứng lớp.',
    targetAudience: [
      'Người muốn theo đuổi nghề nghiệp Huấn luyện viên Yoga chuyên nghiệp',
      'HLV Yoga hiện tại muốn nâng cao trình độ lên E-RYT hoặc chuyên sâu Trị liệu',
      'Người làm việc trong ngành y tế, vật lý trị liệu muốn bổ trợ Yoga'
    ],
    duration: '3 tháng / 6 tháng / 1 năm (Khung 200h & 500h)',
    schedule: 'Sáng Thứ 2 - Thứ 4 - Thứ 6: 09:00 – 12:00 hoặc Tối T7',
    format: 'Trực tiếp tại Studio & Thực tập',
    priceDisplay: 'Liên hệ VICI',
    priceDetail: 'Học phí theo chính sách đào tạo. Liên hệ Hotline/Zalo 0366.840.130 để nhận hồ sơ.',
    priceStatus: 'ON REQUEST',
    benefits: [
      'Bằng tốt nghiệp chứng nhận năng lực chuyên môn do VICI Yoga Therapy cấp',
      'Chứng nhận phối hợp cùng các Hiệp hội Yoga / Học viện Y dược uy tín',
      'Giáo trình bài bản kết hợp 6D Yoga, giải phẫu học và vận động trị liệu',
      'Cơ hội trở thành trợ giảng hoặc cộng sự tại hệ thống VICI Studio'
    ],
    outcomes: [
      'Tự tin thiết kế giáo án giảng dạy lớp cộng đồng và cá nhân hóa',
      'Nắm vững kỹ thuật đọc vị cơ xương khớp và hỗ trợ học viên bị đau mỏi',
      'Xây dựng thương hiệu cá nhân và định hướng sự nghiệp bền vững'
    ],
    photoUrl: VICI_ASSETS.trainer.primary,
    sourcePhotoUrl: VICI_ASSETS.trainer.sourceUrl
  },
  {
    id: 'course-english-ayurveda',
    name: 'Khóa Đào Tạo: Yoga English & Ayurveda Movement',
    category: 'training',
    badge: 'Chữa lành Thân - Tâm (Khai giảng T10/2026)',
    shortDesc: 'Kỹ năng đứng lớp bằng tiếng Anh, chuyển động Ayurveda và phục hồi thể thao Myofascial.',
    fullDesc: 'Chương trình đặc biệt duy nhất khai giảng vào Tháng 10/2026. Bao gồm: Ayurveda Movement (chuyển động chữa lành Thân - Tâm), Yoga English (tự tin đứng lớp cho người nước ngoài), Phục hồi thể thao Myofascial (giải tỏa đau vai cổ gáy & phục hồi cột sống), Đọc vị tổn thương năng lượng cột sống.',
    targetAudience: [
      'HLV muốn mở rộng thị trường giảng dạy cho người nước ngoài, resort cao cấp',
      'Yogi muốn am hiểu y học Ayurveda truyền thống Ấn Độ',
      'Người muốn nắm bắt phương pháp giải cơ Myofascial trong thể thao'
    ],
    duration: 'Khóa chuyên đề theo tuần',
    schedule: 'Sáng: 09:30 - 12:00 (T2-4-6 hoặc T3-T5) hoặc Lớp Cuối tuần (T7 & CN)',
    format: 'Trực tiếp tại Studio',
    priceDisplay: 'Liên hệ VICI',
    priceDetail: 'Đang mở danh sách đăng ký giữ chỗ. Hotline/Zalo: 0366.840.130.',
    priceStatus: 'ON REQUEST',
    benefits: [
      'Bộ tài liệu giáo án song ngữ Anh - Việt chuyên sâu',
      'Đề luyện thở chuyên sâu và video hướng dẫn chuyển động Ayurveda',
      'Master Henry Phan trực tiếp đứng lớp truyền thụ kinh nghiệm',
      'Cấp chứng nhận hoàn thành chương trình bồi dưỡng chuyên môn'
    ],
    outcomes: [
      'Giao tiếp và hướng dẫn điều chỉnh tư thế bằng tiếng Anh tự nhiên',
      'Ứng dụng phương pháp cân bằng Dosha trong Ayurveda vào lối sống và bài tập',
      'Giải tỏa các tổn thương cơ xơ cứng bằng liệu pháp Myofascial'
    ],
    photoUrl: VICI_ASSETS.ayurveda.primary,
    sourcePhotoUrl: VICI_ASSETS.ayurveda.sourceUrl
  },
  {
    id: 'corporate-wellness',
    name: 'Giải Pháp Sức Khỏe Doanh Nghiệp (Corporate Wellness)',
    category: 'corporate',
    badge: 'Bệnh viện & Doanh nghiệp',
    shortDesc: 'Chuỗi workshop chỉnh dáng văn phòng, giảm áp lực cột sống cho cán bộ nhân viên tổ chức.',
    fullDesc: 'Được bảo chứng bởi hơn 45+ đối tác doanh nghiệp lớn và kinh nghiệm đào tạo trực tiếp cho hàng trăm y bác sĩ tại Bệnh viện Đa khoa Tâm Anh và Vinpearl. Chương trình giúp doanh nghiệp giảm thiểu các bệnh nghề nghiệp (đau vai gáy, thoát vị đĩa đệm, stress), nâng cao hiệu suất làm việc.',
    targetAudience: [
      'Doanh nghiệp công nghệ, ngân hàng, văn phòng ít vận động',
      'Bệnh viện, cơ sở y tế cần phục hồi sức bền cho nhân viên',
      'Các tổ chức muốn tổ chức Retreat chăm sóc sức khỏe cho ban lãnh đạo'
    ],
    duration: 'Thiết kế theo nhu cầu (Workshop 1 buổi / Khóa 1-3 tháng)',
    schedule: 'Linh hoạt tại trụ sở doanh nghiệp hoặc Studio VICI',
    format: 'Doanh nghiệp',
    priceDisplay: 'Thiết kế theo yêu cầu',
    priceDetail: 'Báo giá dựa trên quy mô số lượng nhân sự và thời lượng.',
    priceStatus: 'ON REQUEST',
    benefits: [
      'Nội dung thực tiễn: ngồi đúng cách, bài tập 5 phút tại bàn làm việc',
      'Trực tiếp chuyên gia Henry Phan và đội ngũ VICI huấn luyện',
      'Báo cáo đánh giá mức độ căng thẳng và cải thiện sau khóa học',
      'Tặng tài liệu cẩm nang tư thế cho từng nhân viên'
    ],
    outcomes: [
      'Giảm trên 60% tình trạng than phiền mỏi cổ vai gáy của nhân viên',
      'Tạo môi trường làm việc nhân văn, gắn kết và tái tạo năng lượng',
      'Xây dựng văn hóa chăm sóc sức khỏe chủ động trong doanh nghiệp'
    ],
    photoUrl: VICI_ASSETS.chanMay.primary,
    sourcePhotoUrl: VICI_ASSETS.chanMay.sourceUrl
  }
];

export const VICI_ACTIVITIES: ActivitySpace[] = [
  {
    id: 'chan-may',
    name: 'Không Gian Yoga Chân Mây',
    subtitle: 'Vinpearl Autograph Collection - Bình Thạnh',
    address: 'Tầng cao Vinpearl Autograph Collection, 720A Điện Biên Phủ, Bình Thạnh, TP. Hồ Chí Minh',
    description: 'Không gian tập luyện giữa lưng chừng mây trời Sài Gòn, nơi học viên được hít thở bầu không khí tĩnh tại, ngắm nhìn toàn cảnh thành phố và buông bỏ hoàn toàn những áp lực thường nhật.',
    highlights: ['Tầm nhìn panorama trên cao', 'Không khí tĩnh lặng biệt lập', 'Trải nghiệm chuẩn wellness quốc tế'],
    photoUrl: VICI_ASSETS.chanMay.primary,
    sourcePhotoUrl: VICI_ASSETS.chanMay.sourceUrl
  },
  {
    id: 'da-chieu',
    name: 'Không Gian Yoga Đa Chiều',
    subtitle: 'PunchKing Fitness – Liên Đoàn Boxing Việt Nam',
    address: 'PunchKing Fitness, Quận 2 (TP. Thủ Đức), TP. Hồ Chí Minh',
    description: 'Sự kết hợp độc đáo giữa năng lượng chuyển động mạnh mẽ và sự cân bằng dẻo dai của Yoga. Nơi các võ sĩ, người tập thể thao và học viên rèn luyện sức bền cột sống, mở rộng biên độ khớp.',
    highlights: ['Kết nối sức mạnh & sự linh hoạt', 'Phục hồi thể thao Myofascial', 'Cơ sở vật chất hiện đại'],
    photoUrl: VICI_ASSETS.daChieu.primary,
    sourcePhotoUrl: VICI_ASSETS.daChieu.sourceUrl
  },
  {
    id: 'vuon-ong',
    name: 'Không Gian Vườn Ong Xóm Lá',
    subtitle: 'ViciYoga Kiều Hùng Wellness Training',
    address: 'Đường Phạm Văn Đồng, TP. Thủ Đức, TP. Hồ Chí Minh',
    description: 'Một ốc đảo xanh bình yên giữa lòng thành phố, nơi có vườn cây trị liệu, tiếng chuông xoay ngân vang và những ly trà thảo mộc thơm lành cho hành trình chữa lành thân tâm.',
    highlights: ['Vườn trị liệu xanh mát', 'Phòng tập microphone net', 'Trà thiền & chuông xoay'],
    photoUrl: VICI_ASSETS.vuonOng.primary,
    sourcePhotoUrl: VICI_ASSETS.vuonOng.sourceUrl
  },
  {
    id: 'ayurveda-garden',
    name: 'Dự Án Vườn Dược Liệu Ayurveda 1.000m²',
    subtitle: 'Nha Trang Healing Retreat',
    address: 'Nha Trang, Tỉnh Khánh Hòa',
    description: 'Dự án vườn dược liệu chữa lành chuẩn Ayurveda đang được VICI triển khai, hướng đến chuỗi nghỉ dưỡng retreat kết hợp y học cổ truyền, yoga trị liệu và liệu pháp thảo dược tự nhiên.',
    highlights: ['Quy mô 1.000m² dược liệu', 'Định hướng retreat quốc tế', 'Chữa lành cùng thiên nhiên'],
    photoUrl: VICI_ASSETS.vuonOng.primary,
    sourcePhotoUrl: VICI_ASSETS.vuonOng.sourceUrl
  }
];

export const VICI_TIMETABLE = [
  {
    time: '05:00 – 06:00',
    name: 'Yoga For Newbie',
    category: 'Lớp nền tảng',
    days: 'Thứ 2 – Thứ 6',
    desc: 'Lớp nền tảng làm quen tư thế cơ bản, hơi thở an toàn cho người mới bắt đầu.',
    target: 'Khách hàng mới'
  },
  {
    time: '06:30 – 07:30',
    name: 'Trị Liệu Chuyên Đề Sáng',
    category: 'Trị liệu mục tiêu & Phục hồi',
    days: 'T2 (Kéo giãn) | T3 (Mở hông) | T4 (Mở vai & Lưng trên) | T5 (Vặn xoắn) | T6 (Thăng bằng)',
    desc: 'Xoay quanh giải tỏa cơ căng cứng, định tuyến các nhóm khớp trọng yếu.',
    target: 'Người ngồi nhiều, đau mỏi'
  },
  {
    time: '08:00 – 09:00',
    name: 'Yoga Dòng Chảy & Cột Sống',
    category: 'Thể lực & Trị liệu cột sống',
    days: 'T2 (Hatha) | T3 (Vinyasa) | T4 (Yin) | T5 (Yoga Detox) | T6 (Ashtanga Cột sống)',
    desc: 'Cân bằng giữa hơi thở, thể lực và bảo vệ cột sống an toàn.',
    target: 'Mọi cấp độ'
  },
  {
    time: '09:00 – 12:00',
    name: 'Đào Tạo HLV Yoga Quốc Tế',
    category: 'Khóa đào tạo chuyên môn',
    days: 'Thứ 2 – Thứ 4 – Thứ 6',
    desc: 'Chuẩn Yoga Alliance Hoa Kỳ (E-RYT 500 & YACEP), trực tiếp Master Henry Phan.',
    target: 'Học viên HLV'
  },
  {
    time: '14:00 – 15:30',
    name: 'Yoga Nâng Cao Ashtanga & Cột Sống',
    category: 'Nâng cao / 10 chuyên đề',
    days: 'Thứ 3 & Thứ 5',
    desc: '10 chuyên đề mở hông, vai, uốn lưng, đảo ngược và handstand an toàn.',
    target: 'Học viên có kinh nghiệm'
  },
  {
    time: '17:45 – 18:45',
    name: 'Lớp Tan Ca Phục Hồi Thân Thể',
    category: 'Kéo giãn & Trị liệu vai gáy',
    days: 'T2 (Hatha) | T3 (Mở vai) | T4 (Dynamic) | T5 (Mở hông) | T6 (Kéo giãn)',
    desc: 'Xả stress và giải phóng bó cơ sau một ngày làm việc mệt mỏi.',
    target: 'Dân văn phòng'
  },
  {
    time: '19:00 – 20:00',
    name: 'Yoga Buổi Tối & Trị Liệu Chuông Xoay',
    category: 'Thư giãn sâu & Trị liệu',
    days: 'T2, T4, T6 (Newbie) | T3 (Gentle) | T5 (Yoga Therapy Chuông xoay) | T7 (Đào tạo HLV)',
    desc: 'Thư giãn sâu, làm dịu tâm trí, chuẩn bị cho giấc ngủ sâu lành.',
    target: 'Người mất ngủ, căng thẳng'
  }
];

export const VICI_FAQ: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Người mới',
    question: 'Tôi chưa từng tập Yoga bao giờ và cơ thể rất cứng, có theo học được không?',
    answer: 'Hoàn toàn phù hợp! Tại VICI, chúng tôi có lớp "Yoga For Newbie" (05:00 - 06:00 và 19:00 - 20:00) được thiết kế riêng cho người mới bắt đầu. Triết lý của VICI là "Thấu hiểu cơ thể", không ép dẻo hay ép cơ quá sức. Giảng viên sẽ căn chỉnh trục nhẹ nhàng theo giới hạn tự nhiên của bạn.'
  },
  {
    id: 'faq-2',
    category: 'Trị liệu',
    question: 'Tôi bị đau mỏi vai gáy và thoát vị đĩa đệm thì nên chọn lớp nào?',
    answer: 'Với tình trạng đau mỏi cơ xương khớp rõ rệt, VICI khuyến nghị bạn nên đặt 01 buổi "Scan Trị liệu Cơ - Vai - Cổ - Gáy" (45-60 phút) trước tiên. Giảng viên sẽ kiểm tra góc lệch cột sống, đo biên độ vận động và đưa ra phác đồ tập luyện cá nhân hóa, sau đó chỉ định lớp nhóm phù hợp (như Shoulder & Upperback, Ashtanga Cột Sống, hoặc PT 1:1).'
  },
  {
    id: 'faq-3',
    category: 'Học phí & Lịch học',
    question: 'Học phí tại VICI Yoga Therapy được tính như thế nào?',
    answer: 'Học phí các gói tập nhóm gồm: Gói 3 tháng: 2.550.000 VNĐ (tương đương 850.000đ/tháng), Gói 6 tháng: 4.800.000 VNĐ (800.000đ/tháng), Gói đặc biệt 1 năm: 8.000.000 VNĐ. Ngoài ra, buổi Scan Trị liệu vai cổ gáy là 650.000đ/buổi, Trị liệu 1-1 chuyên sâu là 1.200.000đ/buổi, và Khóa Yoga Nâng Cao Ashtanga 10 buổi là 1.290.000đ (giá Early Bird).'
  },
  {
    id: 'faq-4',
    category: 'Đào tạo HLV',
    question: 'Bằng cấp tốt nghiệp khóa Huấn luyện viên Yoga tại VICI có giá trị thế nào?',
    answer: 'Học viên tốt nghiệp sẽ được cấp Bằng tốt nghiệp chứng nhận năng lực chuyên môn do VICI Yoga Therapy Training Center cấp, cùng các Chứng nhận hoàn thành bồi dưỡng chuyên môn phối hợp cùng các Hiệp hội Yoga / Học viện Y dược uy tín, theo chuẩn Yoga Alliance Hoa Kỳ (E-RYT 500 & YACEP).'
  },
  {
    id: 'faq-5',
    category: 'Chính sách',
    question: 'Chính sách bảo lưu hoặc đổi lịch tập tại VICI quy định ra sao?',
    answer: 'Học viên được bảo lưu tối đa 06 tháng đối với lớp Đào tạo HLV và 03 tháng đối với gói Trị liệu khi có lý do sức khỏe hoặc công tác đột xuất (thông báo trước 3 ngày). Đối với ca tập 1-1, vui lòng báo trước ít nhất 04 tiếng nếu cần đổi lịch để không bị tính buổi.'
  },
  {
    id: 'faq-6',
    category: 'Trị liệu',
    question: 'Yoga trị liệu có cam kết chữa khỏi bệnh cột sống không?',
    answer: 'VICI tuân thủ nghiêm ngặt nguyên tắc Y đức và khoa học: Chúng tôi không chẩn đoán bệnh thay bác sĩ và không khẳng định Yoga chữa khỏi bệnh. Yoga Therapy tại VICI là phương pháp phục hồi chức năng tự nhiên, hỗ trợ giải tỏa áp lực đè nặng lên cơ xương khớp, tăng cường tuần hoàn và kích hoạt khả năng tự hồi phục của cơ thể.'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'VICI-LEAD-101',
    createdAt: '2026-09-12 14:35',
    name: 'Nguyễn Thị Mai Lan',
    phone: '0912 345 678',
    email: 'mailan.nguyen@gmail.com',
    source: 'VICI AI Advisor',
    interest: 'Trị liệu Cơ - Vai - Cổ - Gáy',
    category: 'THERAPY_INTEREST',
    experience: 'Dưới 6 tháng',
    goals: ['Giảm đau vai gáy', 'Cải thiện giấc ngủ', 'Chỉnh dáng ngồi văn phòng'],
    preferredTime: 'Tối (17:45 - 19:00)',
    preferredFormat: 'Trực tiếp tại Studio',
    recommendedCourse: 'Scan Trị Liệu Cơ - Vai - Cổ - Gáy + Gói 3 Tháng',
    leadScore: 'HOT',
    status: 'New',
    assignedTo: 'Master Mỹ Kiều',
    conversationSummary: 'Khách hàng làm lập trình viên, đau mỏi bả vai và cổ nhiều tháng nay do ngồi máy tính liên tục. Muốn đặt lịch Scan cơ ban đầu và tham gia lớp tối.',
    conversationHistory: [
      { sender: 'user', text: 'Chào VICI, mình bị đau cổ vai gáy mấy tháng nay rất khó chịu, nhờ tư vấn giúp', time: '14:30' },
      { sender: 'ai', text: 'Xin chào chị Mai Lan. VICI rất đồng cảm với tình trạng căng cứng cổ vai gáy của chị. Chị đã từng kiểm tra hoặc tập Yoga trước đây chưa ạ?', time: '14:31' },
      { sender: 'user', text: 'Mình chưa tập bao giờ, muốn được kiểm tra trước khi tập lớp', time: '14:32' },
      { sender: 'ai', text: 'Dạ, VICI gợi ý chị đặt 1 buổi Scan Trị liệu Cơ - Vai - Cổ - Gáy (45-60 phút) để Master tầm soát điểm đau và hướng dẫn lộ trình phù hợp ạ!', time: '14:33' }
    ],
    staffNotes: 'Khách có dấu hiệu mỏi cơ bả vai do ngồi máy tính nhiều. Đã đặt lịch sơ bộ chiều Thứ 3.',
    nextAction: 'Gọi xác nhận lịch hẹn Scan 1-1 lúc 18:00 Thứ 3',
    isSampleData: true
  },
  {
    id: 'VICI-LEAD-102',
    createdAt: '2026-09-12 11:20',
    name: 'Trần Minh Quang',
    phone: '0988 765 432',
    email: 'quang.tran@techcorp.vn',
    source: 'Website Form',
    interest: 'Khóa Yoga Nâng Cao Ashtanga (10 chuyên đề)',
    category: 'ADVANCED',
    experience: 'Trên 1 năm',
    goals: ['Chinh phục Handstand an toàn', 'Mở khớp hông và lưng trên', 'Cân bằng thể lực'],
    preferredTime: 'Chiều Thứ 3 - Thứ 5 (14:00 - 15:30)',
    preferredFormat: 'Trực tiếp tại Studio',
    recommendedCourse: 'Yoga Nâng Cao Ashtanga & Năng Lượng Cột Sống (10 buổi)',
    leadScore: 'HOT',
    status: 'Contacted',
    assignedTo: 'Master Henry Phan',
    conversationSummary: 'Đã tập Yoga được 2 năm, muốn theo học trực tiếp cùng Thầy Henry để căn chỉnh kỹ thuật uốn lưng và chuối đầu an toàn.',
    staffNotes: 'Đã gọi điện trao đổi, khách rất hào hứng với 10 chuyên đề của Thầy Henry. Chờ chuyển khoản ưu đãi Early Bird 1.290.000đ.',
    nextAction: 'Gửi thông tin xác nhận chuyển khoản và vị trí phòng tập Opal Boulevard',
    isSampleData: true
  },
  {
    id: 'VICI-LEAD-103',
    createdAt: '2026-09-11 16:45',
    name: 'Lê Hoàng Yến',
    phone: '0903 214 567',
    email: 'hoangyen.le@gmail.com',
    source: 'VICI AI Advisor',
    interest: 'Đào tạo Huấn Luyện Viên Yoga Quốc Tế',
    category: 'TRAINER_EDUCATION',
    experience: 'Trên 1 năm',
    goals: ['Trở thành HLV Yoga trị liệu', 'Lấy chứng chỉ quốc tế Yoga Alliance', 'Mở lớp riêng'],
    preferredTime: 'Sáng Thứ 2 - 4 - 6 (09:00 - 12:00)',
    preferredFormat: 'Trực tiếp tại Studio & Thực tập',
    recommendedCourse: 'Đào Tạo Huấn Luyện Viên Yoga Quốc Tế (E-RYT 500 / YACEP)',
    leadScore: 'WARM',
    status: 'Consulting',
    assignedTo: 'Master Henry Phan',
    conversationSummary: 'Khách hàng có định hướng chuyển đổi nghề nghiệp sang HLV Yoga Trị liệu, quan tâm bằng cấp và cơ hội thực tập tại VICI.',
    staffNotes: 'Đang xem xét thời gian biểu sáng 2-4-6. Hẹn gửi brochure chi tiết khung 200h/500h.',
    nextAction: 'Gửi tài liệu chương trình đào tạo HLV và xếp lịch gặp trực tiếp Thầy Henry',
    isSampleData: true
  },
  {
    id: 'VICI-LEAD-104',
    createdAt: '2026-09-11 09:10',
    name: 'Phạm Đức Thắng',
    phone: '0977 123 999',
    source: 'Website Form',
    interest: 'Workshop Liệu Pháp Chuông Xoay',
    category: 'WORKSHOP',
    experience: 'Chưa từng',
    goals: ['Giảm stress áp lực quản lý', 'Trải nghiệm thiền chuông xoay', 'Cải thiện giấc ngủ'],
    preferredTime: 'Cuối tuần (Thứ 7)',
    preferredFormat: 'Trực tiếp tại Studio',
    recommendedCourse: 'Workshop Liệu Pháp Chuông Xoay & Chánh Niệm',
    leadScore: 'HOT',
    status: 'Trial',
    assignedTo: 'Master Mỹ Kiều',
    conversationSummary: 'Đăng ký tham dự Workshop Chuông Xoay tuần thứ 2 của tháng.',
    staffNotes: 'Đã giữ chỗ tham gia Workshop Chuông Xoay Thứ 7 tuần này.',
    nextAction: 'Nhắc lịch tham gia trước 1 ngày qua Zalo/SMS',
    isSampleData: true
  }
];

export const VICI_FEEDBACKS: StudentFeedback[] = [
  {
    id: 'fb-01',
    name: 'Chị Hoàng Thảo My',
    role: 'Trưởng phòng Marketing (32 tuổi)',
    course: 'Gói Yoga Cá Nhân Hóa 6 Tháng',
    improvement: 'Giảm 85% đau mỏi cổ vai gáy sau 4 tuần',
    comment: 'Ngồi máy tính 10 tiếng mỗi ngày khiến vai gáy mình cứng đơ, đau lan lên đỉnh đầu. Sau khi được Master Henry nắn chỉnh trục và tập theo phác đồ cá nhân hóa tại VICI, mình cảm nhận rõ sự nhẹ nhõm, không còn phải uống thuốc giảm đau nữa.',
    rating: 5,
    tags: ['Đau vai gáy', 'Dân văn phòng', 'Cá nhân hóa']
  },
  {
    id: 'fb-02',
    name: 'Anh Trần Quốc Bảo',
    role: 'Kỹ sư phần mềm (36 tuổi)',
    course: 'Scan Trị Liệu & Lớp Cột Sống',
    improvement: 'Phục hồi thoát vị L4-L5, không còn tê chân',
    comment: 'Từng rất sợ tập Yoga vì sợ chấn thương thêm cột sống. Nhưng thầy Henry giảng giải giải phẫu học cực kỳ khoa học, chỉnh từng góc đặt chân, kiểm soát cơ lõi. Giờ lưng mình khỏe hơn nhiều, cúi ngửa hoàn toàn tự nhiên.',
    rating: 5,
    tags: ['Thoát vị L4-L5', 'Trị liệu cột sống', 'Định tuyến an toàn']
  },
  {
    id: 'fb-03',
    name: 'Chị Nguyễn Phương Linh',
    role: 'Chủ doanh nghiệp thời trang (41 tuổi)',
    course: 'Workshop Chuông Xoay & Yoga Phục Hồi',
    improvement: 'Chấm dứt mất ngủ kinh niên, ngủ sâu 7 tiếng',
    comment: 'Áp lực công việc khiến mình bị mất ngủ suốt 2 năm. Các buổi trị liệu chuông xoay của Master Mỹ Kiều thực sự là món quà cứu rỗi thân tâm. Sóng rung chuông xoay kết hợp thở Pranayama giúp tâm trí mình lắng dịu hoàn toàn.',
    rating: 5,
    tags: ['Chuông xoay', 'Chữa mất ngủ', 'Thư giãn thân tâm']
  },
  {
    id: 'fb-04',
    name: 'Chị Đặng Thu Hà',
    role: 'Học viên K18 Đào tạo HLV (28 tuổi)',
    course: 'Đào Tạo HLV Yoga Quốc Tế E-RYT 500',
    improvement: 'Tự tin đứng lớp và thiết kế giáo án trị liệu',
    comment: 'Khóa HLV tại VICI vượt xa kỳ vọng của mình. Thầy Henry Phan truyền dạy trọn vẹn kinh nghiệm từ Bệnh viện Tâm Anh và Rishikesh. Bằng cấp quốc tế Yoga Alliance giúp mình tự tin mở studio riêng tại Bình Dương.',
    rating: 5,
    tags: ['Nghề HLV', 'Yoga Alliance', 'Master Henry']
  },
  {
    id: 'fb-05',
    name: 'Bác Vũ Đình Dũng',
    role: 'Cán bộ hưu trí (58 tuổi)',
    course: 'Lớp Yoga For Newbie Sáng 5h',
    improvement: 'Hết cứng khớp gối buổi sáng, huyết áp ổn định',
    comment: 'Lúc đầu ngại vì lớn tuổi, nhưng không khí ở VICI rất ấm áp và nhẹ nhàng. Các huấn luyện viên kiên nhẫn điều chỉnh cho người lớn tuổi. Giờ 5h sáng thức dậy đi tập đã thành niềm vui không thể thiếu mỗi ngày.',
    rating: 5,
    tags: ['Người lớn tuổi', 'Lớp Newbie 5h sáng', 'Khớp gối']
  }
];
