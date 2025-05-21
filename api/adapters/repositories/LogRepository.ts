import { Log as LogEntity } from '../../entities/Log';
import { ILog, Log } from '../../frameworks/orm/models/Log';

export class LogRepository {
  async create(logData: LogEntity): Promise<ILog> {
    const log = new Log(logData);
    return await log.save();
  }

  async findById(id: string): Promise<ILog | null> {
    return await Log.findById(id);
  }

  async findAll(): Promise<ILog[]> {
    return await Log.find().sort({ timestamp: -1 });
  }

  async findByLevel(level: string): Promise<ILog[]> {
    return await Log.find({ level }).sort({ timestamp: -1 });
  }

  async findByService(service: string): Promise<ILog[]> {
    return await Log.find({ service }).sort({ timestamp: -1 });
  }

  async findByTimeRange(startDate: Date, endDate: Date): Promise<ILog[]> {
    return await Log.find({
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ timestamp: -1 });
  }

  async deleteOldLogs(olderThan: Date): Promise<void> {
    await Log.deleteMany({ timestamp: { $lt: olderThan } });
  }
}
