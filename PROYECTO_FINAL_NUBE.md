# Proyecto Integrador: Salud Total
**Estudiante:** Maria Belen Becerra Rivera  
**Semestre:** Séptimo Semestre  
**Carrera:** Ingeniería de Software  
**Asignatura:** Computación en la Nube (ISW-341)  
**Docente:** Ing. Fabrizio Gustavo Bellido Parra  
**Institución:** Universidad Católica Boliviana "San Pablo", Sede Santa Cruz  

---

## 1. Ficha Técnica del Proyecto Base
Salud Total es una plataforma integral de gestión médica diseñada bajo una arquitectura desacoplada y nativa de la nube.
- **Frontend:** Desarrollado con **React + Vite** y Tailwind CSS, optimizado para ser servido como contenido estático mediante Nginx.
- **Backend:** API REST construida con **NestJS**, utilizando Prisma como ORM para la interacción con la base de datos.
- **Flujos CRUD Principales:**
    1. **Gestión de Pacientes:** Registro, consulta de historial y actualización de datos personales.
    2. **Agenda de Citas:** Creación de citas médicas, visualización en calendario y cancelación.
    3. **Expediente Médico:** Registro de diagnósticos y recetas por parte del personal médico.

---

## 2. Definición de Arquitectura de Red y Nube
La infraestructura se despliega en **AWS Learner Lab**, utilizando un clúster ligero de Kubernetes (K3s).

```text
       [ Internet ]
            |
            v
    +-------------------------------------------------------+
    | AWS Cloud (VPC)                                       |
    |                                                       |
    |  +-------------------------------------------------+  |
    |  | EC2 Instance (t3.medium) - K3s Cluster          |  |
    |  |                                                 |  |
    |  |  [ Service: NodePort (30080) ]                  |  |
    |  |            |                                    |  |
    |  |            v                                    |  |
    |  |  [ Pod: Frontend (React) ]                      |  |
    |  |            |                                    |  |
    |  |            +------> [ Pod: Backend (NestJS) ]   |  |
    |  |                            | (ClusterIP)        |  |
    |  +----------------------------|--------------------+  |
    |                               |                       |
    |  +----------------------------v--------------------+  |
    |  | AWS RDS (PostgreSQL)                            |  |
    |  | (Managed DB Instance)                           |  |
    |  +-------------------------------------------------+  |
    |                                                       |
    +-------------------------------------------------------+
```

---

### 3. Registro de Decisiones de Arquitectura (ADR)

#### ADR-001: Uso de K3s autohospedado en EC2 en lugar de Amazon EKS
* **Fecha:** 2026-06-16
* **Estado:** Aceptada
* **Contexto y Problema:** El entorno de AWS Academy Learner Lab prohíbe explícitamente la creación de nuevos roles IAM, lo cual es un requisito estricto para desplegar un clúster administrado con Amazon EKS. Además, el costo fijo por hora de EKS consumiría rápidamente el límite estricto de $50 USD del laboratorio.
* **Opciones Consideradas:** 1. Amazon EKS (Servicio administrado por AWS).
  2. K3s (Distribución ligera de Kubernetes) sobre una instancia EC2.
* **Decisión Tomada:** Implementar la **Opción 2** (K3s sobre instancia EC2 `t3.medium`).
* **Justificación:** K3s permite empaquetar, orquestar y escalar los contenedores de la aplicación "Salud Total" operando de forma nativa bajo el `LabInstanceProfile` preexistente. Esto evade las trabas administrativas de IAM, garantiza compatibilidad total con los manifiestos de Kubernetes (Deployment, Service, HPA) exigidos en la rúbrica, y mantiene el costo operativo alrededor de los $15 USD mensuales.
* **Consecuencias Positivas:** Control total del clúster, optimización extrema de costos y cumplimiento técnico del Pilar 1 sin violar políticas del Learner Lab.
* **Consecuencias Negativas:** Se asume la gestión manual del clúster y la carencia de alta disponibilidad nativa al operar en un esquema *Single-Node*.

#### ADR-002: Desacoplamiento de Base de Datos utilizando Supabase (BaaS) en lugar de AWS RDS
* **Fecha:** 2026-06-16
* **Estado:** Aceptada
* **Contexto y Problema:** Desplegar una base de datos transaccional dentro de los pods de Kubernetes (como un contenedor volátil) representa un riesgo crítico de pérdida de datos médicos. Por otro lado, aprovisionar un clúster de AWS RDS PostgreSQL sumaría costos adicionales que pondrían en riesgo el límite de presupuesto mensual del Learner Lab.
* **Opciones Consideradas:** 1. Base de datos PostgreSQL contenerizada en K3s con PersistentVolumes.
  2. AWS RDS for PostgreSQL.
  3. Supabase (PostgreSQL administrado como servicio - BaaS).
* **Decisión Tomada:** Implementar la **Opción 3** (Supabase).
* **Justificación:** Adoptar Supabase permite mantener la capa de persistencia 100% desacoplada de la capa de cómputo (cumpliendo el nivel Excelente del Pilar 1) sin consumir recursos de cómputo del servidor EC2 ni presupuesto de AWS. Supabase ofrece PostgreSQL administrado en la nube con un *free tier* generoso que soporta holgadamente la carga de la aplicación médica, aislando los datos de manera segura fuera de la instancia de EC2.
* **Consecuencias Positivas:** Ahorro total del presupuesto de base de datos en AWS, inyección directa de variables de entorno mediante secretos (`DATABASE_URL`), y alta disponibilidad de los datos.
* **Consecuencias Negativas:** Dependencia de red hacia un proveedor externo (Supabase) ajeno a la VPC de AWS.

---

## 4. Guía de Despliegue (Runbook)

### Paso 1: Acceso a la Infraestructura
```bash
ssh -i "tu-llave.pem" ubuntu@<98.93.36.3>
```

### Paso 2: Instalación de K3s (Si no existe)
```bash
curl -sfL https://get.k3s.io | sh -
sudo chmod 644 /etc/rancher/k3s/k3s.yaml
```

### Paso 3: Aplicar Manifiestos
```bash
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/hpa.yaml
```

### Paso 4: Verificación
```bash
kubectl get pods
kubectl get svc
```

---

## 5. Reporte de Consumo y Costos
Estimación mensual basada en precios de la región `us-east-1` para AWS Learner Lab.

| Recurso | Tipo / Configuración | Costo Est. Mensual |
| :--- | :--- | :--- |
| **EC2 Instance** | t3.medium (2 vCPU, 4GB RAM) | ~$30.00 |
| **AWS RDS** | db.t3.micro (PostgreSQL) | ~$15.00 |
| **EBS Storage** | 20GB General Purpose SSD | ~$2.00 |
| **Data Transfer** | Outbound Internet | ~$2.00 |
| **TOTAL** | | **~$49.00 USD** |

*El presupuesto total de $50 USD es respetado estrictamente.*

---

## 6. Selección de Pilares (Rúbrica)
1. **Pilar 1: Contenedores y Orquestación:** Uso de Docker para empaquetado y K3s (Kubernetes) para la gestión del ciclo de vida de los pods y autoescalado (HPA).
2. **Pilar 3: Automatización de Pipelines:** Implementación de GitHub Actions con validación de tests, escaneo de seguridad (Trivy) y despliegue continuo mediante `workflow_dispatch`.

---

## 7. Declaración de Failsafe de Seguridad
Se confirma que toda la infraestructura sigue el principio de **Privilegio Mínimo**. Los secretos de producción (Base de datos, tokens de API) y las credenciales temporales de AWS se inyectan dinámicamente en el pipeline y los contenedores, garantizando que no existan credenciales en texto plano dentro del repositorio de código.
