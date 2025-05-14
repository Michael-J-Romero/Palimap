import { Box, Typography, Stack } from '@mui/material';

export default function GuidelinesPage() {
  return (
    <Box py={4} px={{ xs: 2, md: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h4" fontWeight={700}>Community Posting Guidelines</Typography>

        <Typography variant="body1">
          Our discussion board is a place for sharing helpful information, requesting support, offering assistance, and
          celebrating recovery. Please follow these guidelines to keep the discussion respectful, useful, and safe for everyone.
        </Typography>

        <Stack spacing={2}>
          <Typography variant="h6">✅ What’s Allowed</Typography>
          <ul>
            <li>Requests for help or support (e.g. cleanup, resources, rebuilding tips)</li>
            <li>Offering volunteer time, tools, or services</li>
            <li>Stories of recovery and rebuilding</li>
            <li>Local safety alerts (e.g. flare-ups, hazards, closures)</li>
            <li>Community news, events, or announcements</li>
            <li>Donations or items available for free</li>
          </ul>

          <Typography variant="h6">🚫 What’s Not Allowed</Typography>
          <ul>
            <li>Harassment, discrimination, or aggressive language</li>
            <li>Political or off-topic content not related to fire recovery</li>
            <li>Spam, advertising, or self-promotion unrelated to the community effort</li>
            <li>False or misleading information</li>
            <li>Duplicate posts or repeated content</li>
          </ul>

          <Typography variant="h6">📌 Posting Tips</Typography>
          <ul>
            <li>Choose the correct category so others can find your post more easily</li>
            <li>Be specific in titles (e.g. "Need help hauling lumber on Saturday" vs. "Need help")</li>
            <li>Include dates, locations, and contact info when appropriate</li>
            <li>Keep it respectful and constructive</li>
          </ul>

          <Typography variant="body2" color="text.secondary">
            Posts that violate guidelines may be removed. Repeat violations may result in a ban.
            Let’s work together to make this a space of trust and support.
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
