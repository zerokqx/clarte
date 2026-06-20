import { useState } from "react";
import { useForm } from "@mantine/form";
import { TextInput, PasswordInput, Button, Paper, Title, Container, Stack } from "@mantine/core";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";

const loginSchema = z.object({
  login: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  const form = useForm<LoginForm>({
    mode: "uncontrolled",
    initialValues: {
      login: "",
      password: "",
    },
    validate: {
      login: (value) => {
        const result = loginSchema.shape.login.safeParse(value);
        return result.success ? null : result.error.errors[0].message;
      },
      password: (value) => {
        const result = loginSchema.shape.password.safeParse(value);
        return result.success ? null : result.error.errors[0].message;
      },
    },
  });

  const handleSubmit = async (values: LoginForm) => {
    setError("");
    const success = await login(values.login, values.password);
    if (success) {
      window.location.href = "/";
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <Container size="xs" mt={100}>
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} ta="center" mb="lg">
          Вход
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Логин"
              placeholder="Введите логин"
              {...form.getInputProps("login")}
            />

            <PasswordInput
              label="Пароль"
              placeholder="Введите пароль"
              {...form.getInputProps("password")}
            />

            {error && (
              <div style={{ color: "red", textAlign: "center", fontSize: "14px" }}>
                {error}
              </div>
            )}

            <Button type="submit" fullWidth loading={isLoading} mt="sm">
              Войти
            </Button>
          </Stack>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#666" }}>
          Нет аккаунта?{" "}
          <a href="/register" style={{ color: "#1a73e8", textDecoration: "none" }}>
            Зарегистрироваться
          </a>
        </div>
      </Paper>
    </Container>
  );
};
