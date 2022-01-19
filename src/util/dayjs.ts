import dayjs from 'dayjs';
import AdvancedFormat from 'dayjs/plugin/advancedFormat';
import RelativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(AdvancedFormat);
dayjs.extend(RelativeTime);
