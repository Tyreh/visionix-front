import PageContainer from "@/components/layout/page-container"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "@/components/ui/card";
import { secureFetch } from "@/secure-fetch";
import { IconCircleFilled } from "@tabler/icons-react";
import Reminder from "./reminder";
import Kanban from "./kanban";

export default async function Page() {
  const userData = await secureFetch(`${process.env.API_URL}/user/logged-user`);
  const loggedUsers = await secureFetch(`${process.env.API_URL}/user/logged-users`);

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <div className='flex items-center justify-center space-y-2 pb-6'>
          <h2 className='text-2xl font-bold tracking-tight'>
            ¡Bienvenido de nuevo, {userData.data.firstName}! 👋
          </h2>
        </div>
        <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full'>
          <Card className="col-span-full lg:col-span-1">
            <CardHeader className='flex flex-row items-center justify-center space-y-0 pb-2'>
              <CardTitle className='text-md font-semibold'>
                Último Inicio de Sesión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-sm text-center'>{userData.data.lastLogin}</div>
              <p className='text-xs text-muted-foreground text-center'>
                IP: {userData.data.lastIpLogin}
              </p>
            </CardContent>
          </Card>
          <Card className="col-span-full lg:col-span-1">
            <CardHeader className='flex flex-row items-center justify-center space-y-0 pb-2'>
              <CardTitle className='text-md font-semibold'>
                Último Cambio de Contraseña
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-sm text-center'>{userData.data.lastPasswordModified || 'Nunca'}</div>
            </CardContent>
          </Card>
          <Card className="col-span-full lg:col-span-1">
            <CardHeader className='flex flex-row items-center justify-center space-y-0 pb-2'>
              <CardTitle className='text-md font-semibold'>Compañía Asignada</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-sm text-center'>{userData.data.company || 'Sin Asignar'}</div>
            </CardContent>
          </Card>

          <Reminder apiUserId={userData.data.id} />

          {/* Tarjeta de Usuarios Activos alineada a la derecha */}
          <Card className="col-span-full lg:col-span-1">
            <CardHeader>
              <CardTitle>Usuarios Activos</CardTitle>
              <CardDescription>Aquí puedes ver la lista de usuarios que están actualmente en línea</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-8'>
                {loggedUsers.data.map((loggedUser, index) =>
                  <div key={index} className='flex items-center'>
                    <Avatar className='h-9 w-9'>
                      <AvatarFallback>{`${loggedUser.firstName?.charAt(0)}${loggedUser.lastName?.charAt(0)}`}</AvatarFallback>
                    </Avatar>

                    <div className='ml-4 space-y-1'>
                      <p className='text-sm font-medium leading-none'>{loggedUser.firstName?.split(' ')[0]} {loggedUser.lastName?.split(' ')[0]}</p>
                      <p className='text-sm text-muted-foreground'>
                        {loggedUser.email}
                      </p>
                    </div>
                    <div className='ml-auto font-medium'><IconCircleFilled className="w-4 h-4 text-green-600" /></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Kanban/>
        </div>
      </div>
    </PageContainer>
  )
}
