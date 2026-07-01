export function calculateProfileCompletion(user: {
  profile: {
    firstName?: string | null;
    lastName?: string | null;
    dateOfBirth?: Date | null;
    gender?: string | null;
    height?: number | null;
    weight?: number | null;
  } | null;
  wellnessPreferences: {
    activityLevel?: string | null;
    primaryGoal?: string | null;
    preferredUnit?: string | null;
    timezone?: string | null;
    locale?: string | null;
  } | null;
}) {
  const completedFields = [
    user.profile?.firstName,
    user.profile?.lastName,
    user.profile?.dateOfBirth,
    user.profile?.gender,
    user.profile?.height,
    user.profile?.weight,
    user.wellnessPreferences?.activityLevel,
    user.wellnessPreferences?.primaryGoal,
    user.wellnessPreferences?.preferredUnit,
    user.wellnessPreferences?.timezone,
    user.wellnessPreferences?.locale,
  ];

  const completed = completedFields.filter(Boolean).length;

  return Math.round(
    (completed / completedFields.length) * 100
  );
}