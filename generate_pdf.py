import os
import sys
from reportlab.lib.pagesizes import landscape, A4
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

# Register Arabic-capable TTF Fonts
pdfmetrics.registerFont(TTFont('Tahoma', 'tahoma.ttf'))
pdfmetrics.registerFont(TTFont('Tahoma-Bold', 'tahomabd.ttf'))

def ar(text):
    """Reshape and reorder Arabic text for correct RTL rendering."""
    if not text:
        return ""
    reshaped_text = arabic_reshaper.reshape(text)
    bidi_text = get_display(reshaped_text)
    return bidi_text

class LuxuryPDFCanvas(canvas.Canvas):
    """Canvas that computes total pages and draws luxury background and header/footer on every slide."""
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
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        width, height = self._pagesize

        # 1. Clean Modern Background (Dark Blue/Slate for extreme legibility)
        self.saveState()
        self.setFillColor(colors.HexColor("#0F172A"))
        self.rect(0, 0, width, height, fill=1, stroke=0)

        # 2. Top Accent Modern Gradient Line
        self.setFillColor(colors.HexColor("#0284C7")) # Blue
        self.rect(0, height - 5, width * 0.4, 5, fill=1, stroke=0)
        self.setFillColor(colors.HexColor("#38BDF8")) # Sky Blue
        self.rect(width * 0.4, height - 5, width * 0.3, 5, fill=1, stroke=0)
        self.setFillColor(colors.HexColor("#F59E0B")) # Gold
        self.rect(width * 0.7, height - 5, width * 0.3, 5, fill=1, stroke=0)

        # 3. Header Bar (Slides 2 to 6)
        if self._pageNumber > 1:
            self.setFillColor(colors.HexColor("#334155"))
            self.rect(32, height - 38, width - 64, 1, fill=1, stroke=0)

            # Logo & Brand Text
            self.setFont("Tahoma-Bold", 10.5)
            self.setFillColor(colors.HexColor("#38BDF8"))
            self.drawString(40, height - 30, "BAYERN SYSTEMS")

            self.setFont("Tahoma", 8.5)
            self.setFillColor(colors.HexColor("#94A3B8"))
            self.drawString(155, height - 30, "|   " + ar("نظام المعاينة والتهيئة الهندسية للمصاعد 3D"))

            # Slide Category Tag
            self.setFont("Tahoma-Bold", 8.5)
            self.setFillColor(colors.HexColor("#F59E0B"))
            tag_text = ar("دليل النظام والمواصفات 2026")
            self.drawRightString(width - 40, height - 30, tag_text)

        # 4. Footer Bar
        self.setFillColor(colors.HexColor("#334155"))
        self.rect(32, 30, width - 64, 1, fill=1, stroke=0)

        self.setFont("Tahoma", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        footer_brand = ar("منظومة Bayern Systems لتصميم كبائن المصاعد التفاعلية © 2026")
        self.drawString(40, 18, footer_brand)

        page_str = ar(f"صفحة {self._pageNumber} من {page_count}")
        self.drawRightString(width - 40, 18, page_str)

        self.restoreState()


def build_pdf(filename="Elevator_Configurator_Presentation_AR.pdf"):
    # Page dimensions for landscape A4
    page_w, page_h = landscape(A4)
    doc = SimpleDocTemplate(
        filename,
        pagesize=landscape(A4),
        leftMargin=32,
        rightMargin=32,
        topMargin=46,
        bottomMargin=36
    )

    # Styles
    style_cover_badge = ParagraphStyle(
        'CoverBadge',
        fontName='Tahoma-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#38BDF8"),
        alignment=1, # Center
        spaceAfter=14
    )

    style_cover_title = ParagraphStyle(
        'CoverTitle',
        fontName='Tahoma-Bold',
        fontSize=24,
        leading=34,
        textColor=colors.HexColor("#FFFFFF"),
        alignment=1,
        spaceAfter=10
    )

    style_cover_sube = ParagraphStyle(
        'CoverSubE',
        fontName='Tahoma-Bold',
        fontSize=13,
        leading=18,
        textColor=colors.HexColor("#F59E0B"),
        alignment=1,
        spaceAfter=14
    )

    style_cover_desc = ParagraphStyle(
        'CoverDesc',
        fontName='Tahoma',
        fontSize=11.5,
        leading=19,
        textColor=colors.HexColor("#CBD5E1"),
        alignment=1,
        spaceAfter=26
    )

    style_slide_title = ParagraphStyle(
        'SlideTitle',
        fontName='Tahoma-Bold',
        fontSize=16,
        leading=22,
        textColor=colors.HexColor("#FFFFFF"),
        alignment=2, # Right
        spaceAfter=3
    )

    style_slide_sub = ParagraphStyle(
        'SlideSub',
        fontName='Tahoma',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#94A3B8"),
        alignment=2, # Right
        spaceAfter=12
    )

    style_card_title = ParagraphStyle(
        'CardTitle',
        fontName='Tahoma-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#38BDF8"),
        alignment=2,
        spaceAfter=8
    )

    style_card_item = ParagraphStyle(
        'CardItem',
        fontName='Tahoma',
        fontSize=9,
        leading=14,
        textColor=colors.HexColor("#F1F5F9"),
        alignment=2,
        spaceAfter=6
    )

    style_stat_num = ParagraphStyle(
        'StatNum',
        fontName='Tahoma-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#38BDF8"),
        alignment=1
    )

    style_stat_lbl = ParagraphStyle(
        'StatLbl',
        fontName='Tahoma',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#CBD5E1"),
        alignment=1
    )

    usable_width = page_w - 64 # 777.89 pt
    story = []

    # ==========================================
    # SLIDE 1: COVER SLIDE
    # ==========================================
    story.append(Spacer(1, 25))
    story.append(Paragraph(ar("نظام العرض والمعاينة الهندسية التفاعلية 3D"), style_cover_badge))
    story.append(Paragraph(ar("منصة تخصيص وتصميم المصاعد الذكية المتكاملة"), style_cover_title))
    story.append(Paragraph(ar("Elevator 3D Interactive Configurator & Instant RFQ Engine"), style_cover_sube))
    story.append(Paragraph(ar("حل تقني هندسي يتيح للعملاء والمكاتب الاستشارية استعراض وتخصيص كبائن المصاعد وخامات الجدران والأسقف والأبواب في بيئة ثلاثية الأبعاد تفاعلية مع حساب فوري لعروض الأسعار وتصدير المواصفات المعتمدة بنقرة زر."), style_cover_desc))

    # Stats Strip
    stat_col_w = usable_width / 4
    stats_data = [
        [
            [Paragraph("100%", style_stat_num), Paragraph(ar("تفاعل ثلاثي الأبعاد فوري"), style_stat_lbl)],
            [Paragraph("5+ Modules", style_stat_num), Paragraph(ar("محاور تخصيص هندسية"), style_stat_lbl)],
            [Paragraph("BOM & PDF", style_stat_num), Paragraph(ar("عروض أسعار تفصيلية"), style_stat_lbl)],
            [Paragraph("60 FPS", style_stat_num), Paragraph(ar("أداء رسومي فائق وسلس"), style_stat_lbl)]
        ]
    ]
    t_stats = Table(stats_data, colWidths=[stat_col_w]*4, hAlign='CENTER')
    t_stats.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#1E293B")),
        ('BOX', (0,0), (-1,-1), 1.5, colors.HexColor("#38BDF8")),
        ('INNERGRID', (0,0), (-1,-1), 1, colors.HexColor("#334155")),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(t_stats)
    story.append(PageBreak())

    # Helper function for card table style
    def get_card_style():
        return TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#1E293B")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#334155")),
            ('INNERGRID', (0,0), (-1,-1), 1, colors.HexColor("#334155")),
            ('TOPPADDING', (0,0), (-1,-1), 10),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10),
            ('LEFTPADDING', (0,0), (-1,-1), 12),
            ('RIGHTPADDING', (0,0), (-1,-1), 12),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ])

    # ==========================================
    # SLIDE 2: 3D ENGINE
    # ==========================================
    story.append(Paragraph(ar("1. قدرات المحرك ثلاثي الأبعاد والفيزياء البصرية"), style_slide_title))
    story.append(Paragraph(ar("بيئة محاكاة واقعية عالية الدقة تعرض الكابينة بكافة تفاصيلها وخاماتها في الوقت الفعلي"), style_slide_sub))

    c1 = [
        Paragraph(ar("🎥 زوايا الكاميرا والمشاهد الذكية"), style_card_title),
        Paragraph(ar("• <b>Interior View:</b> معاينة داخلية شاملة بزاوية رؤية واسعة لأرجاء الكابينة."), style_card_item),
        Paragraph(ar("• <b>Hall / Lobby View:</b> رؤية الأبواب والمصعد من ردهة المبنى الخارجية."), style_card_item),
        Paragraph(ar("• <b>Ceiling & Floor Focus:</b> توجيه الكاميرا فورياً لفحص تفاصيل السقف والإنارة أو رخام الأرضية."), style_card_item),
        Paragraph(ar("• <b>Orbit Controls:</b> دوران حر 360 درجة، تكبير وتصغير وتعديل إمالة المشهد بسلاسة."), style_card_item),
    ]

    c2 = [
        Paragraph(ar("💡 فيزياء الإضاءة والمرايا (PBR)"), style_card_title),
        Paragraph(ar("• <b>انعكاسات المرايا الحقيقية:</b> محاكاة فيزيائية فائقة للزجاج والمرايا على الجدار الخلفي والجانبي."), style_card_item),
        Paragraph(ar("• <b>نظام الإنارة المزدوج:</b> إضاءة سقفية مباشرة (Spotlights) مدمجة مع إنارة محيطية مخفية (Cove LED)."), style_card_item),
        Paragraph(ar("• <b>Contact Shadows:</b> إسقاط ظلال ناعمة ودقيقة تعطي إحساساً هندسياً واقعياً بالعمق."), style_card_item),
    ]

    c3 = [
        Paragraph(ar("🚪 محاكاة الحركة والمؤثرات الصوتية"), style_card_title),
        Paragraph(ar("• <b>أبواب تفاعلية (Door Animation):</b> إمكانية فتح وإغلاق أبواب الكابينة بنقرة زر واحدة بحركة ميكانيكية ناعمة."), style_card_item),
        Paragraph(ar("• <b>مؤثرات صوتية هيدروليكية:</b> صوت نغمة وصول المصعد (Arrival Chime) وصوت تشغيل الأبواب والمحرك."), style_card_item),
        Paragraph(ar("• <b>Ghost Mode:</b> إمكانية جعل الجدران شفافة لمعاينة الشاسيه والهيكل الإنشائي الداخلي."), style_card_item),
    ]

    col3_w = (usable_width - 24) / 3
    t_engine = Table([[c1, c2, c3]], colWidths=[col3_w, col3_w, col3_w], hAlign='CENTER')
    t_engine.setStyle(get_card_style())
    story.append(t_engine)
    story.append(PageBreak())

    # ==========================================
    # SLIDE 3: CUSTOMIZATION STEPS
    # ==========================================
    story.append(Paragraph(ar("2. مراحل وخيارات التخصيص المعماري للكابينة"), style_slide_title))
    story.append(Paragraph(ar("أكثر من 50 تركيبة خامات وتجهيزات تمنح العميل حرية كاملة في اختيار مواصفات كابينته"), style_slide_sub))

    m1 = [
        Paragraph(ar("⚡ 1. القوالب الجاهزة (Presets)"), style_card_title),
        Paragraph(ar("• <b>Bavarian Executive:</b> خشب جوز ألماني فاخر مع ذهب شامبانيا ورخام كرارا."), style_card_item),
        Paragraph(ar("• <b>Neo Luxury Glass:</b> زجاج مدخن عاكس مع سقف ألياف ضوئية وإطارات سوداء."), style_card_item),
        Paragraph(ar("• <b>Alpine Timber:</b> أخشاب الدردار الفاتحة مع ستانلس ستيل مصقول عالي الجودة."), style_card_item),
    ]

    m2 = [
        Paragraph(ar("🧱 2. الجدران والمرايا (Walls)"), style_card_title),
        Paragraph(ar("• ستانلس ستيل عالي المقاومة (Hairline Steel, Gold Mirror, Matte Black)."), style_card_item),
        Paragraph(ar("• خشب طبيعي مصفح معالج ضد الرطوبة والحريق."), style_card_item),
        Paragraph(ar("• مرايا كاملة الارتفاع أو نصف جدار لتوسيع مدى الرؤية والرحابة."), style_card_item),
    ]

    m3 = [
        Paragraph(ar("🏛️ 3. الأرضيات والأسقف"), style_card_title),
        Paragraph(ar("• <b>الأرضيات:</b> رخام كرارا إيطالي، جرانيت أسود ملكي، باركيه خشب ألماني، أو فينيل عملي."), style_card_item),
        Paragraph(ar("• <b>الأسقف:</b> شبكات LED حديثة، سقف نجوم الألياف الضوئية (Starlight)، وإنارة مخفية."), style_card_item),
    ]

    m4 = [
        Paragraph(ar("🎛️ 4. الأبواب ولوحة الـ COP"), style_card_title),
        Paragraph(ar("• <b>الأبواب:</b> فتح مركزي (Center) أو جانبي تلسكوبي (Telescopic) بسرعات متزامنة."), style_card_item),
        Paragraph(ar("• <b>لوحة COP:</b> أزرار برايل دائرية ومربعة مضيئة مع شاشات TFT ديجيتال ملونة."), style_card_item),
        Paragraph(ar("• <b>الدرابزين:</b> ستانلس أو ذهبي دائري ومسطح."), style_card_item),
    ]

    col4_w = (usable_width - 36) / 4
    t_mods = Table([[m1, m2, m3, m4]], colWidths=[col4_w]*4, hAlign='CENTER')
    t_mods.setStyle(get_card_style())
    story.append(t_mods)
    story.append(PageBreak())

    # ==========================================
    # SLIDE 4: PRICING & BOM
    # ==========================================
    story.append(Paragraph(ar("3. محرك التسعير الفوري وإصدار عروض الأسعار (RFQ & BOM)"), style_slide_title))
    story.append(Paragraph(ar("ربط قرارات التصميم الجمالية بالحسابات المالية والهندسية الدقيقة لأتمتة عروض الأسعار"), style_slide_sub))

    b1 = [
        Paragraph(ar("💰 التسعير الديناميكي المباشر"), style_card_title),
        Paragraph(ar("• تحديث لحظي لسعر الباقة التقديري فور تغيير أي خامة أو إكسسوار في الكابينة."), style_card_item),
        Paragraph(ar("• احتساب فوارق تكلفة التشطيبات الفاخرة (مثل الرخام الطبيعي والمرايا الذهبية مقابل الخامات القياسية)."), style_card_item),
        Paragraph(ar("• إدراج تكلفة الأنظمة الذكية والشاشات الرقمية والتجهيزات الكهربائية تلقائياً."), style_card_item),
    ]

    b2 = [
        Paragraph(ar("📄 تصدير تقرير مواصفات PDF معتمد"), style_card_title),
        Paragraph(ar("• توليد وثيقة مواصفات هندسية رسمية بنقرة زر واحدة عبر محرك PDF المدمج."), style_card_item),
        Paragraph(ar("• جدول حصر كميات تفصيلي (Bill of Materials) لكل جزء ومادة داخل الكابينة."), style_card_item),
        Paragraph(ar("• كود مرجعي تسلسلي خاص بكل تصميم (BS-RFQ Reference) لتسهيل المتابعة الفنية وأوامر الشراء."), style_card_item),
    ]

    b3 = [
        Paragraph(ar("✉️ نظام طلب العرض الرقمي (RFQ)"), style_card_title),
        Paragraph(ar("• نموذج تفاعلي لإدخال بيانات العميل، نوع المشروع وموقعه الجغرافي وعدد الوقفات."), style_card_item),
        Paragraph(ar("• إرسال وتوجيه الطلب مباشرة لفريق المبيعات عبر منصة المراسلة السحابية (Resend API)."), style_card_item),
        Paragraph(ar("• تحويل الاستفسار المبدئي إلى عرض سعر رسمي مؤتمت خلال دقائق معدودة."), style_card_item),
    ]

    t_pricing = Table([[b1, b2, b3]], colWidths=[col3_w, col3_w, col3_w], hAlign='CENTER')
    t_pricing.setStyle(get_card_style())
    story.append(t_pricing)
    story.append(PageBreak())

    # ==========================================
    # SLIDE 5: ROADMAP
    # ==========================================
    story.append(Paragraph(ar("4. خارطة طريق التحسينات والميزات المستقبلية الموصى بها"), style_slide_title))
    story.append(Paragraph(ar("التطويرات المقترحة لرفع كفاءة المنصة إلى مصاف كبرى شركات المصاعد العالمية"), style_slide_sub))

    f1 = [
        Paragraph(ar("🌐 1. التعريب والعملات الإقليمية (i18n)"), style_card_title),
        Paragraph(ar("• واجهة استخدام عربية بالكامل مع دعم كامل لاتجاه RTL وتصميم متناسق."), style_card_item),
        Paragraph(ar("• تعريب دقيق لجميع المصطلحات الهندسية المتعارف عليها في أسواق الشرق الأوسط والخليج."), style_card_item),
        Paragraph(ar("• دعم تحويل العملات اللحظي (ريال سعودي، درهم، دينار كويتي، دولار أمريكي)."), style_card_item),
    ]

    f2 = [
        Paragraph(ar("📐 2. محرر الأبعاد والحمولة الحقيقي"), style_card_title),
        Paragraph(ar("• <b>Parametric Sizing:</b> إدخال أبعاد بئر المصعد والكابينة بالملم (عرض، عمق، ارتفاع)."), style_card_item),
        Paragraph(ar("• <b>حساب السعة والحمولة:</b> تحديد حمولة المصعد وعدد الركاب (450kg - 1600kg / 6 - 21 شخص)."), style_card_item),
        Paragraph(ar("• <b>Human Scale:</b> إظهار مجسم بشري ثلاثي الأبعاد لتقدير المساحة والارتفاع الحقيقي."), style_card_item),
    ]

    f3 = [
        Paragraph(ar("🔗 3. المشاركة والواقع المعزز (AR/VR)"), style_card_title),
        Paragraph(ar("• <b>Shareable URL:</b> إنشاء رابط فريد لحفظ ومشاركة التصميم مع العملاء عبر الواتساب."), style_card_item),
        Paragraph(ar("• <b>High-Res 4K Render:</b> زر لالتقاط صور فائقة الجودة من أي زاوية وتحميلها فوراً."), style_card_item),
        Paragraph(ar("• <b>معاينة AR:</b> عرض الكابينة داخل الموقع الإنشائي الحقيقي عبر كاميرا الجوال."), style_card_item),
    ]

    t_road = Table([[f1, f2, f3]], colWidths=[col3_w, col3_w, col3_w], hAlign='CENTER')
    t_road.setStyle(get_card_style())
    story.append(t_road)
    story.append(PageBreak())

    # ==========================================
    # SLIDE 6: CONCLUSION
    # ==========================================
    story.append(Paragraph(ar("5. القيمة المضافة للنظام ومستقبل منصة Bayern Systems"), style_slide_title))
    story.append(Paragraph(ar("نقلة نوعية في كفاءة المبيعات الهندسية، تقليص فترات التفاوض، وزيادة رضا العملاء"), style_slide_sub))

    g1 = [
        Paragraph(ar("🏆 العائد على الاستثمار وقوة المبيعات (Business Impact)"), style_card_title),
        Paragraph(ar("• <b>تقليص دورة المبيعات:</b> الاستغناء عن أسابيع الانتظار لتوليد رسومات الأوتوكاد والريندر المعماري عبر المعاينة الفورية."), style_card_item),
        Paragraph(ar("• <b>ثقة العميل المطلقة:</b> إتاحة تجربة بصرية تفاعلية تجعل العميل يرى كابينته بدقة ووضوح قبل توقيع عقود التوريد."), style_card_item),
        Paragraph(ar("• <b>تقليل الأخطاء الإنشائية:</b> مطابقة مواصفات الخامات والأبواب رقمياً قبل الانتقال لمرحلة التصنيع الفعلي."), style_card_item),
        Paragraph(ar("• <b>هوية بصرية رائدة:</b> منح الشركة مظهراً تقنياً متقدماً يتفوق على المنافسين التقليديين في قطاع المصاعد."), style_card_item),
    ]

    g2 = [
        Paragraph(ar("🚀 الجاهزية للربط والتكامل الصناعي (Integration Ready)"), style_card_title),
        Paragraph(ar("• <b>التوافق مع نماذج BIM:</b> إمكانية استيراد ملفات GLB ثلاثية الأبعاد المصممة ببرامج Autodesk Revit و 3ds Max."), style_card_item),
        Paragraph(ar("• <b>الربط مع أنظمة الـ ERP:</b> إمكانية تصدير قوائم الـ BOM مباشرة إلى خطوط الإنتاج وبرامج إدارة المخزون."), style_card_item),
        Paragraph(ar("• <b>تجربة مستخدم سريعة:</b> يعمل بكفاءة على كافة المتصفحات الحديثة والأجهزة اللوحية دون الحاجة لتثبيت أي برامج."), style_card_item),
    ]

    col2_w = (usable_width - 16) / 2
    t_conc = Table([[g1, g2]], colWidths=[col2_w, col2_w], hAlign='CENTER')
    t_conc.setStyle(get_card_style())
    story.append(t_conc)

    doc.build(story, canvasmaker=LuxuryPDFCanvas)
    print(f"Successfully generated: {filename}")

if __name__ == "__main__":
    build_pdf()
