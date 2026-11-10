import WidgetKit
import SwiftUI

private let appGroup = "group.com.scripture.mobileapp"
private let urlScheme = "scripture"

struct VerseEntry: TimelineEntry {
    let date: Date
    let text: String
    let reference: String
    let version: String
    let book: String
    let chapter: Int
    let verse: Int
    let accentLight: String
    let accentDark: String
}

private struct StoredVerse: Decodable {
    let day: String
    let text: String
    let reference: String
    let version: String
    let book: String
    let chapter: Int
    let verse: Int
    let accentLight: String
    let accentDark: String
}

extension Color {
    init(hex: String) {
        let cleaned = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var value: UInt64 = 0
        Scanner(string: cleaned).scanHexInt64(&value)
        let r = Double((value >> 16) & 0xFF) / 255
        let g = Double((value >> 8) & 0xFF) / 255
        let b = Double(value & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}

struct VerseProvider: TimelineProvider {
    func placeholder(in context: Context) -> VerseEntry {
        fallback()
    }

    func getSnapshot(in context: Context, completion: @escaping (VerseEntry) -> Void) {
        completion(entries().first ?? fallback())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<VerseEntry>) -> Void) {
        completion(Timeline(entries: entries(), policy: .atEnd))
    }

    private func fallback() -> VerseEntry {
        VerseEntry(
            date: Date(),
            text: "Open Scripture to load today’s verse.",
            reference: "Verse of the day",
            version: "",
            book: "JHN",
            chapter: 3,
            verse: 16,
            accentLight: "#B07A2E",
            accentDark: "#D4AF37"
        )
    }

    private func entry(from item: StoredVerse, date: Date) -> VerseEntry {
        VerseEntry(
            date: date,
            text: item.text,
            reference: item.reference,
            version: item.version,
            book: item.book,
            chapter: item.chapter,
            verse: item.verse,
            accentLight: item.accentLight,
            accentDark: item.accentDark
        )
    }

    private func entries() -> [VerseEntry] {
        guard
            let defaults = UserDefaults(suiteName: appGroup),
            let raw = defaults.string(forKey: "week"),
            let data = raw.data(using: .utf8),
            let items = try? JSONDecoder().decode([StoredVerse].self, from: data),
            !items.isEmpty
        else {
            return [fallback()]
        }

        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.timeZone = TimeZone.current

        let todayStart = Calendar.current.startOfDay(for: Date())
        var result: [VerseEntry] = []

        for item in items {
            guard let day = formatter.date(from: item.day), day >= todayStart else { continue }
            result.append(entry(from: item, date: day == todayStart ? Date() : day))
        }

        if result.isEmpty, let last = items.last {
            result = [entry(from: last, date: Date())]
        }
        return result
    }
}

struct WidgetBackground: View {
    @Environment(\.widgetFamily) private var family
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        if family == .accessoryRectangular {
            Color.clear
        } else {
            colorScheme == .dark ? Color(hex: "#3A2429") : Color(hex: "#6E323D")
        }
    }
}

struct VerseWidgetView: View {
    @Environment(\.widgetFamily) private var family
    let entry: VerseEntry

    private var referenceLine: String {
        entry.version.isEmpty ? entry.reference : "\(entry.reference) · \(entry.version)"
    }

    var body: some View {
        switch family {
        case .accessoryRectangular:
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.reference)
                    .font(.system(size: 12, weight: .semibold))
                    .widgetAccentable()
                Text(entry.text)
                    .font(.system(size: 12, design: .serif))
                    .lineLimit(3)
                    .minimumScaleFactor(0.8)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        default:
            VStack(alignment: .leading, spacing: 8) {
                Text("VERSE OF THE DAY")
                    .font(.system(size: 9, weight: .semibold))
                    .tracking(1.4)
                    .foregroundColor(Color.white.opacity(0.7))
                Text(entry.text)
                    .font(.system(size: family == .systemSmall ? 13 : 17, design: .serif))
                    .foregroundColor(Color(hex: "#FDF8F0"))
                    .lineLimit(family == .systemSmall ? 6 : 4)
                    .minimumScaleFactor(0.7)
                Spacer(minLength: 0)
                HStack(spacing: 6) {
                    Rectangle()
                        .fill(Color(hex: entry.accentDark))
                        .frame(width: 16, height: 2)
                    Text(referenceLine)
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(Color.white.opacity(0.85))
                        .lineLimit(1)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        }
    }
}

struct VerseWidget: Widget {
    let kind = "VerseWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: VerseProvider()) { entry in
            VerseWidgetView(entry: entry)
                .widgetURL(
                    URL(string: "\(urlScheme)://read?book=\(entry.book)&chapter=\(entry.chapter)&verse=\(entry.verse)")
                )
                .containerBackground(for: .widget) {
                    WidgetBackground()
                }
        }
        .configurationDisplayName("Verse of the day")
        .description("A verse to start your day. Tap to read the passage.")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular])
    }
}