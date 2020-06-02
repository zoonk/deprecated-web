import { Profile } from './profile';

/**
 * User model
 */
export namespace User {
  export type NotificationType = 'app' | 'email';

  export interface NotificationSettings {
    contentChanges: NotificationType[];
  }

  export interface Response extends Profile.Response {
    notifications: number;
    notificationSettings: NotificationSettings;
    role: 'admin' | 'moderator' | 'viewer';
  }

  export interface Get extends Response {
    email: string | null;
    uid: string;
  }

  export interface Snapshot extends Get {
    snap: firebase.firestore.DocumentSnapshot;
  }

  export interface Update {
    notifications?: number;
    notificationSettings?: NotificationSettings;
  }
}
