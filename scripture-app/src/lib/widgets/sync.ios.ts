import { ExtensionStorage } from '@bacons/apple-targets';
import { WIDGET_APP_GROUP } from '@/lib/widgets/config';
import { WidgetSnapshot } from '@/lib/widgets/snapshot';

const storage = new ExtensionStorage(WIDGET_APP_GROUP);

export async function syncWidget(week: WidgetSnapshot[]): Promise<void> {
  if (week.length === 0) return;
  storage.set('week', JSON.stringify(week));
  ExtensionStorage.reloadWidget();
}