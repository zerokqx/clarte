import { useState } from "react";
import { useForm, schemaResolver } from "@mantine/form";
import { TextInput, PasswordInput, Button, Paper, Title, Container, Stack } from "@mantine/core";
import { z } from "zod";
import { authApi } from "../api/auth";

const registerSchema = z
  .object({
    login: z.string().min(3, "Логин должен быть минимум 3 символа"),
    password: z.string()
      .min(8, "Пароль должен быть минимум 8 символов")
      .regex(/[A-Z]/, "Пароль должен содержать заглавную букву")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Пароль должен содержать спецсимвол")
      .regex(/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/, "Только латинские буквы"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const form = useForm<RegisterForm>({
    initialValues: {
      login: "",
      password: "",
      confirmPassword: "",
    },
    validate: schemaResolver(registerSchema, { sync: true }),
  });

  const handleSubmit = async (values: RegisterForm) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      await authApi.register({
        login: values.login,
        password: values.password,
      });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Ошибка регистрации";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xs" mt={100}>
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} ta="center" mb="lg">
          Регистрация
        </Title>

        {success ? (
          <div style={{ textAlign: "center", color: "green" }}>
            <p> Регистрация успешна!</p>
            <p>Перенаправление на страницу входа...</p>
          </div>
        ) : (
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
              
              <PasswordInput
                label="Повторите пароль"
                placeholder="Повторите пароль"
                {...form.getInputProps("confirmPassword")}
              />

              {error && (
                <div style={{ color: "red", textAlign: "center", fontSize: "14px" }}>
                  {error}
                </div>
              )}

              <Button type="submit" fullWidth loading={isLoading}>
                Зарегистрироваться
              </Button>
            </Stack>
          </form>
        )}

        <div style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Уже есть аккаунт? <a href="/login" style={{ color: "#1a73e8", textDecoration: "none" }}>Войти</a>
        </div>
      </Paper>
    </Container>
  );
};
