import os
import sys
from reportlab.lib.pagesizes import A4, portrait
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
import arabic_reshaper
from bidi.algorithm import get_display
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register Fonts
pdfmetrics.registerFont(TTFont('Tahoma', 'tahoma.ttf'))
pdfmetrics.registerFont(TTFont('Tahoma-Bold', 'tahomabd.ttf'))
pdfmetrics.registerFont(TTFont('Arial', 'arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold', 'arialbd.ttf'))

def ar(text):
    """Reshape and reorder Arabic text for proper RTL display."""
    if not text:
        return ""
    reshaped_text = arabic_reshaper.reshape(text)
    bidi_text = get_display(reshaped_text)
    return bidi_text

class ExecutiveCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_decorations(self, page_count):
        w, h = self._pagesize
        self.saveState()

        # Top Bar
        self.setFont("Tahoma", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(36, h - 22, ar("دولة قطر — منظومة تهيئة وتصميم المصاعد Bayern 3D"))
        self.drawRightString(w - 36, h - 22, "2026/08/28")

        # Bottom Bar
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(36, 28, w - 36, 28)

        self.setFont("Tahoma", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(36, 16, f"{self._pageNumber}/{page_count}")
        self.drawRightString(w - 36, 16, ar("منظومة Bayern Systems 3D Configurator V3.0 — الدوحة، دولة قطر"))

        self.restoreState()


def build_executive_proposal(filename="Elevator_Executive_Proposal_AR.pdf"):
    page_w, page_h = portrait(A4) # 595.27 x 841.89 pt
    margin = 36
    usable_w = page_w - (margin * 2) # 523.27 pt

    doc = SimpleDocTemplate(
        filename,
        pagesize=portrait(A4),
        leftMargin=margin,
        rightMargin=margin,
        topMargin=36,
        bottomMargin=36
    )

    # Styles
    s_title = ParagraphStyle(
        'DocTitle',
        fontName='Tahoma-Bold',
        fontSize=14,
        leading=20,
        textColor=colors.HexColor("#881337"), # Burgundy Red
        alignment=1, # Center
        spaceAfter=3
    )

    s_subtitle = ParagraphStyle(
        'DocSubTitle',
        fontName='Tahoma',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#475569"),
        alignment=1,
        spaceAfter=10
    )

    s_sec_title = ParagraphStyle(
        'SecTitle',
        fontName='Tahoma-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#881337"),
        alignment=2 # Right
    )

    s_th = ParagraphStyle(
        'TableHead',
        fontName='Tahoma-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1E293B"),
        alignment=1
    )

    s_td_cat = ParagraphStyle(
        'TableCat',
        fontName='Tahoma-Bold',
        fontSize=7.5,
        leading=10.5,
        textColor=colors.HexColor("#0F172A"),
        alignment=1
    )

    s_td_legacy = ParagraphStyle(
        'TableLegacy',
        fontName='Tahoma',
        fontSize=7.2,
        leading=10,
        textColor=colors.HexColor("#64748B"),
        alignment=2
    )

    s_td_nextgen = ParagraphStyle(
        'TableNextGen',
        fontName='Tahoma-Bold',
        fontSize=7.2,
        leading=10,
        textColor=colors.HexColor("#0F172A"),
        alignment=2
    )

    s_kpi_num = ParagraphStyle(
        'KpiNum',
        fontName='Tahoma-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#0284C7"),
        alignment=1
    )

    s_kpi_lbl = ParagraphStyle(
        'KpiLbl',
        fontName='Tahoma',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#475569"),
        alignment=1
    )

    s_roi_title = ParagraphStyle(
        'RoiTitle',
        fontName='Tahoma-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#881337"),
        alignment=2
    )

    s_roi_desc = ParagraphStyle(
        'RoiDesc',
        fontName='Tahoma',
        fontSize=7,
        leading=9.5,
        textColor=colors.HexColor("#334155"),
        alignment=2
    )

    s_road_tag = ParagraphStyle(
        'RoadTag',
        fontName='Tahoma-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#881337"),
        alignment=1,
        spaceAfter=3
    )

    s_road_title = ParagraphStyle(
        'RoadTitle',
        fontName='Tahoma-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#0F172A"),
        alignment=1,
        spaceAfter=6
    )

    s_road_item = ParagraphStyle(
        'RoadItem',
        fontName='Tahoma',
        fontSize=7.2,
        leading=10,
        textColor=colors.HexColor("#334155"),
        alignment=2,
        spaceAfter=4
    )

    story = []

    # =========================================================================
    # PAGE 1
    # =========================================================================

    # Header branding table
    cell_tag = [
        Paragraph(ar("وثيقة استراتيجية سرية"), ParagraphStyle('BT', fontName='Tahoma-Bold', fontSize=8, leading=10, textColor=colors.HexColor("#9F1239"), alignment=2)),
        Paragraph(ar("التاريخ: 2026 • إصدار V3.0"), ParagraphStyle('BD', fontName='Tahoma', fontSize=7, leading=9, textColor=colors.HexColor("#64748B"), alignment=2))
    ]

    cell_logo = [
        Paragraph("BAYERN SYSTEMS", ParagraphStyle('BL', fontName='Arial-Bold', fontSize=12, leading=14, textColor=colors.white, alignment=1)),
        Paragraph(ar("شركة بايرن للأنظمة ذ.م.م — الدوحة، دولة قطر QA"), ParagraphStyle('BS', fontName='Tahoma', fontSize=6.5, leading=8.5, textColor=colors.HexColor("#475569"), alignment=1))
    ]

    t_header = Table([[cell_tag, cell_logo]], colWidths=[usable_w * 0.45, usable_w * 0.55], hAlign='CENTER')
    t_header.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#881337")),
        ('TEXTCOLOR', (1,0), (1,0), colors.white),
        ('PADDING', (1,0), (1,0), 6),
        ('LINEBELOW', (0,0), (-1,-1), 1.5, colors.HexColor("#881337")),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_header)
    story.append(Spacer(1, 8))

    # Hero Titles
    story.append(Paragraph(ar("خطة التطوير الشاملة والتحول الرقمي لمنظومة Bayern 3D Configurator"), s_title))
    story.append(Paragraph(ar("رؤية تقنية واستثمارية لنقل إدارة مبيعات وتصميم المصاعد الهندسية إلى الصدارة في دولة قطر والخليج العربي"), s_subtitle))

    # 4 KPI Metrics
    kpi_w = usable_w / 4
    k1 = [Paragraph("-70%", ParagraphStyle('K1', parent=s_kpi_num, textColor=colors.HexColor("#881337"))), Paragraph(ar("تقليص زمن الاستجابة للمبيعات"), s_kpi_lbl)]
    k2 = [Paragraph("99.8%", ParagraphStyle('K2', parent=s_kpi_num, textColor=colors.HexColor("#059669"))), Paragraph(ar("الجاهزية التفاعلية للكابينة"), s_kpi_lbl)]
    k3 = [Paragraph(ar("5+ موديول"), s_kpi_num), Paragraph(ar("مسارات وخيارات التخصيص"), s_kpi_lbl)]
    k4 = [Paragraph(ar("عربي / English"), ParagraphStyle('K4', parent=s_kpi_num, fontSize=9.5, textColor=colors.HexColor("#0284C7"))), Paragraph(ar("دعم اللغات والتصدير"), s_kpi_lbl)]

    t_kpis = Table([[k1, k2, k3, k4]], colWidths=[kpi_w]*4, hAlign='CENTER')
    t_kpis.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.75, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_kpis)
    story.append(Spacer(1, 10))

    # Section 1: Comparison
    story.append(Paragraph(ar("| 1. مقارنة النقلة النوعية للمنظومة (التطوير المنجز بالفعل)"), s_sec_title))
    story.append(Spacer(1, 4))

    col_cat_w = usable_w * 0.20
    col_leg_w = usable_w * 0.38
    col_nxt_w = usable_w * 0.42

    comp_data = [
        [Paragraph(ar("الوضع الحالي بعد التطوير (Next-Gen 3D)"), s_th), Paragraph(ar("الوضع السابق (Legacy / التقليدي)"), s_th), Paragraph(ar("المجال"), s_th)],
        [
            Paragraph(ar("محرك 3D تفاعلي فوري يعرض الكابينة بزاوية 360° مع انعكاسات المرايا والإنارة الحقيقية."), s_td_nextgen),
            Paragraph(ar("كتالوجات ورقية ثابتة أو انتظار أسابيع لرسومات أوتوكاد وريندر معماري مكلف وبطيء."), s_td_legacy),
            Paragraph(ar("معاينة الكابينة والتصميم"), s_td_cat)
        ],
        [
            Paragraph(ar("أكثر من 50 تركيبة فورية (رخام كرارا، ستانلس ذهبي، خشب جوز، سقف ألياف Starlight)."), s_td_nextgen),
            Paragraph(ar("عينات مادية مبعثرة وصعوبة تخيل دمج الألوان والخامات مع الهيكل الإنشائي."), s_td_legacy),
            Paragraph(ar("تخصيص الخامات والمواد"), s_td_cat)
        ],
        [
            Paragraph(ar("محرك تسعير فوري ديناميكي (BOM) يحسب تكلفة الباقة تلقائياً فور تغيير أي خامة."), s_td_nextgen),
            Paragraph(ar("حساب يدوي عبر Excel يستغرق أياماً ويتعرض لأخطاء التسعير الفردية."), s_td_legacy),
            Paragraph(ar("حساب التكاليف والـ BOM"), s_td_cat)
        ],
        [
            Paragraph(ar("توليد تقرير مواصفات فنية معتمد PDF فورياً مع كود مرجعي تسلسلي (BS-RFQ)."), s_td_nextgen),
            Paragraph(ar("صياغة عروض الأسعار والمواصفات يدوياً مما يؤخر الرد على المطورين."), s_td_legacy),
            Paragraph(ar("إصدار التقارير وعروض الأسعار"), s_td_cat)
        ],
    ]

    t_comp = Table(comp_data, colWidths=[col_nxt_w, col_leg_w, col_cat_w], hAlign='CENTER')
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('BACKGROUND', (0,1), (0,-1), colors.HexColor("#F0FDF4")), # Green tint for Next-Gen
        ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0,0), (-1,-1), 4.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4.5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_comp)
    story.append(Spacer(1, 8))

    # Section 2: ROI
    story.append(Paragraph(ar("| 2. العائد الاستثماري والقيمة المضافة لشركة بايرن (Business ROI)"), s_sec_title))
    story.append(Spacer(1, 4))

    roi_w = usable_w / 2 - 4
    r1 = [
        Paragraph(ar("⚡ تسريع دورة المبيعات وزيادة معدل التحويل"), s_roi_title),
        Paragraph(ar("تمكين فريق المبيعات من بناء الكابينة مع العميل مباشرة في أول اجتماع، مما يمنحه ثقة بصرية مطلقة ويقضي على فترات التردد في التعاقد."), s_roi_desc)
    ]
    r2 = [
        Paragraph(ar("💰 أتمتة طلبات عروض الأسعار (Instant RFQ)"), s_roi_title),
        Paragraph(ar("ربط واجهة التصميم بنظام مراسلة رقمي يرسل تفاصيل التكوين والمقاسات المطلوبة مباشرة لمهندسي التسعير دون وسطاء."), s_roi_desc)
    ]
    r3 = [
        Paragraph(ar("🛡️ القضاء على الأخطاء الإنشائية والتوريدية"), s_roi_title),
        Paragraph(ar("تطابق تام بين ما يختاره العميل في العرض ثلاثي الأبعاد وما يتم إدراجه في جداول حصر المواد (BOM) المصدرة للمصنع."), s_roi_desc)
    ]
    r4 = [
        Paragraph(ar("🏢 إبهار كبار العملاء في قطر (لوسيل، اللؤلؤة، الخليج الغربي)"), s_roi_title),
        Paragraph(ar("تقارير صيانة ومواصفات بصرية فورية تعزز ثقة المطورين وتضمن تجديد عقود التوريد بنسب نجاح تتجاوز 95%."), s_roi_desc)
    ]

    t_roi = Table([[r2, r1], [r4, r3]], colWidths=[roi_w, roi_w], hAlign='CENTER')
    t_roi.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F8FAFC")),
        ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0,0), (-1,-1), 0.75, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_roi)

    # PAGE BREAK TO PAGE 2
    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: ROADMAP
    # =========================================================================
    story.append(t_header)
    story.append(Spacer(1, 14))

    story.append(Paragraph(ar("| 3. خارطة طريق الترقيات الذكية القادمة (Strategic Roadmap)"), s_sec_title))
    story.append(Paragraph(ar("المراحل التنفيذية لترقية النظام وربطه بالذكاء الاصطناعي والأنظمة المؤسسية"), s_subtitle))
    story.append(Spacer(1, 6))

    col_road_w = (usable_w - 16) / 3

    p1 = [
        Paragraph(ar("المرحلة الأولى • الميدان والهندسة"), s_road_tag),
        Paragraph(ar("العمليات الميدانية الذكية"), s_road_title),
        Paragraph(ar("• <b>محرر الأبعاد البارامتري:</b> إدخال أبعاد بئر المصعد والكابينة بالملم (عرض، عمق، ارتفاع)."), s_road_item),
        Paragraph(ar("• <b>تحديد الحمولة والسعة:</b> حساب عدد الركاب والوزن بالكيلوغرام (450kg إلى 1600kg)."), s_road_item),
        Paragraph(ar("• <b>المقياس البشري (Human Scale):</b> إظهار مجسم ثلاثي الأبعاد لتقدير الرحابة الداخلية."), s_road_item),
        Paragraph(ar("• <b>دعم مجسمات Revit و 3ds Max:</b> استيراد ملفات GLB المعمارية مباشرة."), s_road_item),
        Paragraph(ar("• <b>دعم العمل بدون إنترنت (Offline PWA):</b> لتشغيل العرض في مواقع الأبراج قيد الإنشاء."), s_road_item),
    ]

    p2 = [
        Paragraph(ar("المرحلة الثانية • الذكاء الاصطناعي"), s_road_tag),
        Paragraph(ar("الذكاء والتنبيهات المباشرة"), s_road_title),
        Paragraph(ar("• <b>مساعد الذكاء الاصطناعي لتشخيص الأعطال:</b> اقتراح أفضل خامات مناسبة لنوع المبنى."), s_road_item),
        Paragraph(ar("• <b>إشعارات وتنبيهات فورية عبر WhatsApp:</b> إرسال ملخص العرض للعميل آلياً."), s_road_item),
        Paragraph(ar("• <b>روابط المشاركة السريعة (Share Link):</b> فتح التكوين المختار بنقرة واحدة."), s_road_item),
        Paragraph(ar("• <b>ريندر فائق الدقة (4K Render):</b> تصدير صور عالية الجودة بضغطة زر."), s_road_item),
        Paragraph(ar("• <b>معاينة الواقع المعزز (AR):</b> إسقاط الكابينة في موقع المشروع عبر كاميرا الهاتف."), s_road_item),
    ]

    p3 = [
        Paragraph(ar("المرحلة الثالثة • التوسع المؤسسي"), s_road_tag),
        Paragraph(ar("بوابة العملاء والربط المالي"), s_road_title),
        Paragraph(ar("• <b>بوابة خاصة لملاك الأبراج وإدارات العقارات:</b> حفظ ومتابعة مصاعد مشاريعهم."), s_road_item),
        Paragraph(ar("• <b>الربط مع الأنظمة المالية (SAP / ERP):</b> ترحيل جدول BOM لأوامر التوريد والتصنيع فورياً."), s_road_item),
        Paragraph(ar("• <b>الفوترة الإلكترونية وتتبع المدفوعات:</b> سداد الدفعات التقديرية رقمياً."), s_road_item),
        Paragraph(ar("• <b>التعريب الكامل (i18n / RTL):</b> دعم العملات الإقليمية (ريال قطري QAR، ريال سعودي SAR، درهم، دولار)."), s_road_item),
    ]

    t_road = Table([[p3, p2, p1]], colWidths=[col_road_w, col_road_w, col_road_w], hAlign='CENTER')
    t_road.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FFFFFF")),
        ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.75, colors.HexColor("#CBD5E1")),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_road)
    story.append(Spacer(1, 14))

    # Concluding Box
    rec_p = [
        Paragraph(ar("📌 الخلاصة والتوصية الفنية:"), ParagraphStyle('RecH', fontName='Tahoma-Bold', fontSize=8.5, leading=11, textColor=colors.HexColor("#881337"))),
        Paragraph(ar("تمثل هذه المنصة نقلة نوعية تضع شركة <b>Bayern Systems</b> في مصاف الشركات العالمية الكبرى (مثل Schindler و Otis و KONE) في توظيف التكنولوجيا ثلاثية الأبعاد التفاعلية لتسريع المبيعات، رفع الكفاءة الهندسية، وتقديم تجربة عميل فاخرة تلبي متطلبات السوق القطري والخليجي."), ParagraphStyle('RecB', fontName='Tahoma', fontSize=7.5, leading=10.5, textColor=colors.HexColor("#4C0519")))
    ]
    t_rec = Table([[rec_p]], colWidths=[usable_w], hAlign='CENTER')
    t_rec.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#FFF1F2")),
        ('BOX', (0,0), (-1,-1), 0.75, colors.HexColor("#FECDD3")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(t_rec)

    doc.build(story, canvasmaker=ExecutiveCanvas)
    print(f"Generated: {filename}")

if __name__ == "__main__":
    build_executive_proposal()
