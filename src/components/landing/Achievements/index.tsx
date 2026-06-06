import {Award, Target} from 'lucide-react';
import {useGuideProgress} from '@site/src/hooks/useGuideProgress';
import {Card, CardContent, CardHeader, CardTitle} from '@site/src/components/ui/Card';
import {getGuideIcon} from '@site/src/components/landing/icons';
import styles from './styles.module.css';

export function Achievements() {
  const {getEarnedBadges, getUnearnedBadges, hydrated} = useGuideProgress();
  const earned = hydrated ? getEarnedBadges() : [];
  const unearned = hydrated ? getUnearnedBadges().slice(0, 4) : [];

  if (!hydrated) {
    return null;
  }

  return (
    <>
      {earned.length > 0 && (
        <section className="landing-section">
          <Card>
            <CardHeader>
              <CardTitle className={styles.titleWithIcon}>
                <Award size={20} aria-hidden />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`landing-grid landing-grid--4 ${styles.badgeGrid}`}>
                {earned.map((badge) => {
                  const BadgeIcon = getGuideIcon(badge.icon);
                  return (
                    <div key={badge.id} className={styles.badgeEarned}>
                      <BadgeIcon className={styles.badgeIcon} aria-hidden />
                      <p className={styles.badgeName}>{badge.name}</p>
                      <p className={styles.badgeDesc}>{badge.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {unearned.length > 0 && (
        <section className="landing-section">
          <Card>
            <CardHeader>
              <CardTitle className={styles.titleWithIcon}>
                <Target size={20} aria-hidden />
                Upcoming Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`landing-grid landing-grid--4 ${styles.badgeGrid}`}>
                {unearned.map((badge) => {
                  const BadgeIcon = getGuideIcon(badge.icon);
                  return (
                    <div key={badge.id} className={styles.badgeLocked}>
                      <BadgeIcon className={styles.badgeIconMuted} aria-hidden />
                      <p className={styles.badgeName}>{badge.name}</p>
                      <p className={styles.badgeDesc}>{badge.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </>
  );
}
