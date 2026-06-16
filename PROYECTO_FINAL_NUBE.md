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

## 3. Registro de Decisiones de Arquitectura (ADR)

### ADR-001: Uso de K3s autohospedado en EC2
- **Estatus:** Aceptado.
- **Contexto:** Las restricciones de AWS Learner Lab impiden el uso de Amazon EKS debido a la falta de permisos de IAM para crear roles de clúster y el alto costo base por hora.
- **Decisión:** Implementar **K3s** sobre una instancia EC2 t3.medium.
- **Consecuencias:** Se reduce el consumo de memoria y CPU comparado con K8s estándar, manteniéndose dentro del presupuesto de $50 USD. Requiere gestión manual de la instancia.

### ADR-002: Desacoplamiento de Base de Datos con AWS RDS
- **Estatus:** Aceptado.
- **Contexto:** Mantener PostgreSQL dentro del clúster K3s en una sola instancia EC2 aumenta el riesgo de pérdida de datos y consumo excesivo de recursos locales.
- **Decisión:** Utilizar **AWS RDS PostgreSQL** externo al clúster de cómputo.
- **Consecuencias:** Mayor resiliencia, backups automáticos y liberación de recursos en la instancia EC2 para los contenedores de aplicación.

---

## 4. Guía de Despliegue (Runbook)

### Paso 1: Acceso a la Infraestructura
```bash
ssh -i "tu-llave.pem" ubuntu@<IP-PUBLICA-EC2>
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
