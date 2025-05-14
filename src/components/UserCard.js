// components/UserCard.jsx
"use client";

import { Card, CardHeader, Avatar, CardContent, Typography, Box } from "@mui/material";

export default function UserCard({ user, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        transition: "0.3s",
        ":hover": { boxShadow: 6 },
        borderRadius: 2,
      }}
    >
      <CardHeader
        avatar={<Avatar src={`https://i.pravatar.cc/150?img=${10+Number(user.id)}`
    } alt={user.name} />}
        title={
          <Typography variant="subtitle1" fontWeight={600} noWrap>
            {user.name}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {user.role}
          </Typography>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {user.shortBio}
        </Typography>
      </CardContent>
    </Card>
  );
}
