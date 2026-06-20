# Clarte Monorepo

✨ Clarte — это современная монорепозиторная архитектура на базе [Nx](https://nx.dev) и [pnpm](https://pnpm.io/), объединяющая микросервисы (NestJS, gRPC), базы данных и очереди сообщений.

---

## Требования (Requirements)
* **Node.js**: `22.21.1` — [Скачать Node.js](https://nodejs.org/)
* **Git** — [Скачать Git](https://git-scm.com/)
* **Docker** & **Docker Compose** — [Скачать Docker Desktop](https://www.docker.com/products/docker-desktop/)
* **OpenSSL** (необязательно, если ключи уже сгенерированы) — требуется для генерации RSA-ключей. В Windows устанавливается командой `winget install ShiningLight.OpenSSL.Light`

---

## Установка и запуск (Installation Guide)

### 🐧 Для Linux / macOS:
> Самый простой способ быстро установить все зависимости и запустить инфраструктуру с микросервисами — запустить скрипт `deploy.bash`:
> ```sh
> chmod +x ./deploy.bash
> ./deploy.bash
> ```
> Скрипт последовательно проверит наличие `pnpm`, установит зависимости проекта, настроит `nx`, запустит Docker-контейнеры окружения и поднимет все сервисы.

### 🪟 Для Windows:
> Вы можете использовать пакетный файл `deploy.bat` для автоматического развертывания под Windows. Убедитесь, что у вас запущен Docker Desktop, затем запустите:
> ```cmd
> .\deploy.bat
> ```
> Данный скрипт установит `pnpm` (если отсутствует), загрузит зависимости, запустит базы данных/очереди в контейнерах и поднимет все NestJS микросервисы.

Для ручного развертывания проекта выполните следующие шаги:

1. **Установите pnpm globally (если не установлен):**
   ```sh
   npm install -g pnpm
   ```

2. **Установите зависимости проекта:**
   ```sh
   pnpm i
   ```

3. **Установите глобально Nx CLI:**
   ```sh
   pnpm add --global nx
   ```

4. **Запустите всю инфраструктуру (базы данных, очереди, pgAdmin):**
   ```sh
   nx run-many --targets=compose-infra-up --no-tui
   ```

5. **Запустите все микросервисы в режиме разработки:**
   ```sh
   nx run-many --targets=serve --no-tui
   ```
   *(или без флага `--no-tui` для интерактивного терминала: `nx run-many --targets=serve`)*

---

## Port Declarations (Распределение портов)

Ниже приведена схема портов, используемых в проекте Clarte:

### Микросервисы (Порты 5000+)
| Сервис | Порт | Протокол | Назначение |
| :--- | :--- | :--- | :--- |
| `api-gateway` | **5000** | HTTP | Входная точка API, Swagger (/docs) |
| `user-service` | **5001** | gRPC | Микросервис пользователей |
| `auth-service` | **5002** | gRPC | Микросервис авторизации |
| `notes-service` | **5003** | gRPC | Микросервис заметок |
| `todo-service` | **5004** | gRPC | Микросервис задач (TODO) |
| `notification-service` | **5005** | gRPC + RMQ | Микросервис уведомлений |

### Базы данных и хранилища (Порты 6000+)
| Ресурс | Порт | Сервис | Назначение |
| :--- | :--- | :--- | :--- |
| `postgres` | **6000** | `user-service` | База данных пользователей |
| `postgres` | **6001** | `notes-service` | База данных заметок |
| `postgres` | **6002** | `todo-service` | База данных задач |
| `postgres` | **6005** | `notification-service` | База данных уведомлений |
| `minio` | **6003** | `root compose` | S3 API MinIO |
| `minio-console` | **6004** | `root compose` | Консоль управления MinIO |

### Очереди и брокеры (Порты 7000+)
| Сервис | Порт | Назначение |
| :--- | :--- | :--- |
| `redis` | **7000** | Общий инстанс Redis (BullMQ, кэш) |
| `rabbitmq` | **7001** | Брокер сообщений RabbitMQ |
| `rabbitmq-dashboard` | **7002** | Панель управления RabbitMQ (Management) |
| `pgadmin` | **5050** | Панель управления PostgreSQL (вне схемы) |

---

## 📖 Документация (Documentation)

* **[Генераторы CQRS (Commands & Queries)](docs/cqrs-generators.md)** — руководство по использованию скриптов автогенерации кода команд и запросов.

