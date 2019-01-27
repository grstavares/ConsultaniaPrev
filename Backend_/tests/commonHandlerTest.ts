import { DependencyInjectorMock } from './mockedDependencies/injectorMock';

export class CommonHandlerTest {

    public async postPromise(object: Object, event: Object, injector: DependencyInjectorMock): Promise<any> { return Promise.reject(); }

}
